import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<any> {
    try {
      const firebaseUser = await firebase.auth().verifyIdToken(token, true);
      
      // FETCH REAL USER FROM DB
      const user = await this.prisma.prisma.user.findUnique({
        where: { firebaseUid: firebaseUser.uid },
      });

      // If user is not in Postgres, we cannot allow Auction creation.
      // This forces them to hit the /login endpoint first.
      if (!user) {
         // Return the firebase user structure temporarily so the Guard doesn't fail, 
         // but the Controller will need to handle it. 
         // Better approach: logic inside Controller handles the check.
         return firebaseUser; 
      }

      return user; // This attaches the Postgres User (with .id) to req.user
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}