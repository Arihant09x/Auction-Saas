import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { captureError } from '../common/monitoring/sentry';
import 'dotenv/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const logger = new Logger('RedisProvider');

export const RedisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT) || 6379;
    const db = Number(process.env.REDIS_DB) || 0;
    const hasPassword = Boolean(process.env.REDIS_PASSWORD);

    logger.log(
      `🔌 Initializing Redis client for ${host}:${port} (DB: ${db}, Auth: ${hasPassword ? 'Enabled' : 'None'})`,
    );

    const redis = new Redis({
      host,
      port,
      db,
      maxRetriesPerRequest: null,
      ...(hasPassword && {
        password: process.env.REDIS_PASSWORD,
      }),
      // Resilience settings
      retryStrategy: (times) => {
        const delay = Math.min(times * 200, 5000); // cap at 5s
        logger.warn(`⚠️  Redis connection retry #${times} in ${delay}ms...`);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetErrors = ['READONLY', 'ECONNRESET'];
        if (targetErrors.some((e) => err.message.includes(e))) {
          logger.warn(`🔄 Redis auto-reconnecting on error: ${err.message}`);
          return true; // auto-reconnect on these
        }
        return false;
      },
      connectTimeout: 10000,
      lazyConnect: false,
    });

    // ── Keep-Alive: prevents idle socket termination by NAT/firewalls ─────────
    const keepAliveTimer = setInterval(async () => {
      try {
        await redis.ping();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.warn(`⚠️  Redis keep-alive ping failed: ${msg}`);
      }
    }, 120000); // 2 minutes

    // Don't let the keep-alive timer prevent Node from exiting
    keepAliveTimer.unref();

    // ── Redis Event Handlers ────────────────────────────────────────────────
    redis.on('connect', () => {
      logger.log(`🟢 TCP connection established to ${host}:${port}`);
    });

    redis.on('ready', () => {
      logger.log(`🟢 Redis client ready and operational on db ${db}`);

      redis
        .ping()
        .then((response) => {
          logger.log(`✅ Health check PING: ${response}`);
        })
        .catch((err: Error) => {
          logger.error(`🔴 PING failed: ${err.message}`, err.stack);
          captureError(err, { layer: 'redis', operation: 'ping' });
        });
    });

    redis.on('error', (err: Error) => {
      logger.error(`🔴 Redis client error: ${err.message}`, err.stack);
      captureError(err, {
        layer: 'redis',
        host,
        port,
      });
    });

    redis.on('close', () => {
      logger.warn('⚠️  Redis connection closed');
    });

    redis.on('reconnecting', (delay: number) => {
      logger.warn(`🔄 Redis reconnecting in ${delay}ms...`);
    });

    redis.on('end', () => {
      clearInterval(keepAliveTimer);
      logger.error('💀 Redis connection ended permanently');
      captureError(new Error('Redis connection ended permanently'), {
        layer: 'redis',
        host,
        port,
      });
    });

    return redis;
  },
};
