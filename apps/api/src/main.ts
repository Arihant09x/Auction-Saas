/**
 * ⚠️  Sentry MUST be imported before everything else.
 * The initSentry() call is a no-op when SENTRY_DSN is not set.
 */

import 'newrelic';

import { initSentry, captureError } from './common/monitoring/sentry';
initSentry(); // Called before NestFactory — captures bootstrap errors too

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import admin from 'firebase-admin';
import helmet from 'helmet';
import 'dotenv/config';
import { json, urlencoded } from 'express';
import https from 'https';

// ── Process-Level Safety Net ─────────────────────────────────────────────────
// Prevents any unhandled Promise rejection from silently killing the Node process.
process.on('unhandledRejection', (reason: unknown) => {
  console.error('🔴 Unhandled Promise Rejection:', reason);
  captureError(
    reason instanceof Error ? reason : new Error(String(reason)),
    { type: 'unhandledRejection' },
  );
  // Do NOT call process.exit() here — let the app continue if possible.
  // Docker/PM2 restarts on exit code ≠ 0 anyway.
});

process.on('uncaughtException', (err: Error) => {
  console.error('💀 Uncaught Exception (fatal):', err);
  captureError(err, { type: 'uncaughtException' });
  // Give Sentry time to flush, then exit (process is in undefined state)
  setTimeout(() => process.exit(1), 2000);
});

async function syncClockSkew(): Promise<void> {
  return new Promise((resolve) => {
    const req = https.request('https://oauth2.googleapis.com', { method: 'HEAD', timeout: 4000 }, (res) => {
      const serverDate = res.headers.date;
      if (serverDate) {
        const remoteMs = new Date(serverDate).getTime();
        const localMs = Date.now();
        const diffMs = remoteMs - localMs;
        if (Math.abs(diffMs) > 10000) {
          console.log(`[TimeSync] Detected ${Math.round(diffMs / 1000)}s clock skew with Google servers. Compensating runtime Date...`);
          const originalDateNow = Date.now;
          Date.now = () => originalDateNow() + diffMs;

          const originalDate = global.Date;
          function SyncedDate(this: any, ...args: any[]) {
            if (args.length === 0) {
              return new originalDate(originalDateNow() + diffMs);
            }
            return new (originalDate as any)(...args);
          }
          SyncedDate.prototype = originalDate.prototype;
          SyncedDate.now = () => originalDateNow() + diffMs;
          SyncedDate.UTC = originalDate.UTC;
          SyncedDate.parse = originalDate.parse;
          global.Date = SyncedDate as any;
        }
      }
      resolve();
    });
    req.on('error', () => resolve());
    req.on('timeout', () => {
      req.destroy();
      resolve();
    });
    req.end();
  });
}

async function bootstrap() {
  await syncClockSkew();
  let serviceAccount: any = null;

  const cleanEnvVar = (val: string | undefined): string | undefined => {
    if (!val) return undefined;
    let cleaned = val.trim();
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    } else if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
      cleaned = cleaned.slice(1, -1);
    }
    cleaned = cleaned.trim();
    if (cleaned.endsWith(',')) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned.trim();
  };

  const privateKey = cleanEnvVar(process.env.FIREBASE_PRIVATE_KEY);
  const clientEmail = cleanEnvVar(process.env.FIREBASE_CLIENT_EMAIL);
  const projectId = cleanEnvVar(process.env.FIREBASE_PROJECT_ID);

  if (privateKey && clientEmail && projectId) {
    serviceAccount = {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };
  }

  if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', e);
    }
  }

  if (!serviceAccount) {
    try {
      serviceAccount = require('../../../vaulted-botany-445315-d7-firebase-adminsdk-1ls4c-08f87214f8.json');
    } catch (e) {
      console.warn('Fallback Firebase service account JSON file not found:', e instanceof Error ? e.message : String(e));
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp();
  }

  const app = await NestFactory.create(AppModule);

  app.use(
    json({
      limit: '50mb',
      verify: (req: any, _res: any, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // 1. Security
  app.use(helmet());

  // 2. Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 3. Global Interceptors & Filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());  // HTTP errors → Sentry

  // 4. CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, Accept, x-razorpay-signature, x-razorpay-event-id',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  (`🚀 Server running on port ${port}`);
  (`🏥 Health: http://localhost:${port}/api/health`);
  (`📊 Metrics: http://localhost:${port}/api/metrics`);
}

bootstrap();
