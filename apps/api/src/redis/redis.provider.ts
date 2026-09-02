import Redis from 'ioredis';
import { captureError } from '../common/monitoring/sentry';
import "dotenv/config"
export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      db: Number(process.env.REDIS_DB) || 0,
      maxRetriesPerRequest: null,
      ...(process.env.REDIS_PASSWORD && {
        password: process.env.REDIS_PASSWORD
      }),
      // Resilience settings
      retryStrategy: (times) => {
        const delay = Math.min(times * 200, 5000); // cap at 5s
        console.warn(`⚠️  Redis retry #${times} in ${delay}ms...`);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetErrors = ['READONLY', 'ECONNRESET'];
        if (targetErrors.some((e) => err.message.includes(e))) {
          return true; // auto-reconnect on these
        }
        return false;
      },
      connectTimeout: 10000,
      lazyConnect: false,
    });

    // ── Event handlers ──────────────────────────────────────────────────
    redis.on('connect', () => {
      (`🔴 Redis connected to ${redis.options.host}:${redis.options.port} [db=${redis.options.db}]`);
    });

    redis.on('ready', () => {
      ('✅ Redis ready');
    });

    redis.on('error', (err: Error) => {
      console.error('❌ Redis error:', err.message);
      captureError(err, { layer: 'redis', host: redis.options.host });
    });

    redis.on('close', () => {
      console.warn('⚠️  Redis connection closed');
    });

    redis.on('reconnecting', (delay: number) => {
      console.warn(`🔄 Redis reconnecting in ${delay}ms...`);
    });

    redis.on('end', () => {
      console.error('🔴 Redis connection ended permanently');
      captureError(new Error('Redis connection ended permanently'), {
        layer: 'redis',
      });
    });

    return redis;
  },
};
