import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { PrismaService } from '../../../prisma/prisma.service';
const FIREBASE_VERIFY_TIMEOUT_MS = 20_000; // 20 seconds max to allow for Neon cold starts
/**
 * Wraps a promise with a hard timeout.
 * If Firebase or DB hangs, this ensures the request fails fast with 401
 * instead of hanging indefinitely in Postman.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<any> {
    // ── Guard: reject immediately if no token is provided ─────────────────
    // passport-firebase-jwt passes null/undefined token when no
    // Authorization header is present. firebase.auth().verifyIdToken(null)
    // hangs indefinitely — never resolves or rejects. Fail fast here.
    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // ── 1. Verify Firebase token (with 10s timeout) ────────────────────
      const firebaseUser = await withTimeout(
        firebase.auth().verifyIdToken(token, true),
        FIREBASE_VERIFY_TIMEOUT_MS,
        'Firebase token verification',
      );

      // ── 2. Fetch Postgres user (with 10s timeout + Retry) ─────────────────────
      let user = null;
      let dbError = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          user = await withTimeout(
            this.prisma.prisma.user.findUnique({
              where: { firebaseUid: firebaseUser.uid },
            }),
            FIREBASE_VERIFY_TIMEOUT_MS,
            'DB user lookup',
          );
          break; // Success!
        } catch (err: any) {
          dbError = err;
          console.warn(`[FirebaseStrategy] DB lookup attempt ${attempt} failed: ${err.message}`);
          if (attempt < 3) {
            // Wait 1s before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      if (!user && dbError) {
        // If it failed after retries, throw so NestJS handles it as 401/500
        throw dbError;
      }

      // No Postgres user → return firebase user (controller can handle)
      if (!user) {
        return firebaseUser;
      }

      return user; // Attaches Postgres User (with .id and .role) to req.user
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[FirebaseStrategy] Auth failed: ${msg}`);
      
      // If it's a DB connection error, we might want to return 503 instead of 401
      // but passport usually expects false or an exception.
      // Throwing will result in a 500/401 depending on the exception type.
      if (msg.includes('Can\'t reach database server')) {
        throw new UnauthorizedException('Database is currently waking up or unreachable. Please try again in a few seconds.');
      }
      
      throw new UnauthorizedException(msg);
    }
  }
}