import Redis from "ioredis";

export const REDIS_CLIENT = "REDIS_CLIENT";

export const RedisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      db: Number(process.env.REDIS_DB) || 0, // 🔒 LOCK DB
      maxRetriesPerRequest: null,
    });

    console.log("🔴 Redis Connected:", {
      host: redis.options.host,
      port: redis.options.port,
      db: redis.options.db,
    });

    return redis;
  },
};
