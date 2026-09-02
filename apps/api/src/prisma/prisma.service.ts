import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { prisma, PrismaClient } from '@repo/database_postgres/db';
import { captureError } from '../common/monitoring/sentry';

const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;
const SLOW_QUERY_THRESHOLD_MS = 500;

/**
 * Neon Postgres auto-suspends after ~5 min of inactivity (free tier).
 * Keep-alive ping interval must be < 5 minutes to prevent suspension.
 */
const NEON_KEEPALIVE_INTERVAL_MS = 10 * 60 * 1000; // 4 minutes

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: PrismaClient = prisma;
  private keepAliveTimer: NodeJS.Timeout | null = null;

  async onModuleInit() {
    await this.connectWithRetry();
    this.registerErrorMonitoring();
    this.startKeepAlive();
  }

  async onModuleDestroy() {
    this.stopKeepAlive();
    await this.client.$disconnect();
  }

  get prisma() {
    return this.client;
  }

  // ── Resilient connection with exponential backoff ───────────────────────
  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log(`✅ PostgreSQL connected (attempt ${attempt})`);
    } catch (err: unknown) {
      const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
      this.logger.error(
        `❌ DB connection failed (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s...`,
        err instanceof Error ? err.message : String(err),
      );

      if (attempt >= MAX_RETRIES) {
        this.logger.fatal('💀 Could not connect to PostgreSQL after max retries. Shutting down.');
        captureError(
          err instanceof Error ? err : new Error('Prisma max retries exhausted'),
          { attempt, maxRetries: MAX_RETRIES },
        );
        setTimeout(() => process.exit(1), 2000);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.connectWithRetry(attempt + 1);
    }
  }

  // ── Neon Keep-Alive: prevents auto-suspend by pinging every 4 minutes ──
  private startKeepAlive(): void {
    this.keepAliveTimer = setInterval(async () => {
      try {
        await this.client.$queryRaw`SELECT 1`;
        this.logger.debug('🏓 Neon keep-alive ping OK');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`⚠️  Keep-alive ping failed: ${msg}. Reconnecting...`);
        await this.reconnect();
      }
    }, NEON_KEEPALIVE_INTERVAL_MS);

    // Don't let the timer prevent Node from exiting
    this.keepAliveTimer.unref();
    this.logger.log(`🏓 Neon keep-alive enabled (every ${NEON_KEEPALIVE_INTERVAL_MS / 60000} min)`);
  }

  private stopKeepAlive(): void {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  // ── Auto-reconnect after Neon drop (E57P01) ─────────────────────────────
  private async reconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
    } catch {
      // Ignore disconnect errors on dead connection
    }
    await this.connectWithRetry();
  }

  // ── Monitor Prisma errors and slow queries ───────────────────────────────
  private registerErrorMonitoring(): void {
    try {
      (this.client as any).$on('query', (e: { query: string; duration: number }) => {
        if (e.duration > SLOW_QUERY_THRESHOLD_MS) {
          this.logger.warn(
            `🐢 Slow query [${e.duration}ms]: ${e.query.slice(0, 120)}`,
          );
          captureError(new Error(`Slow DB query: ${e.duration}ms`), {
            query: e.query.slice(0, 200),
            duration: e.duration,
          });
        }
      });

      (this.client as any).$on('error', async (e: { message: string }) => {
        const msg = String(e.message || '');
        // Ignore unique constraint violations in the global logger as they are handled in services
        if (msg.includes('Unique constraint failed') || msg.includes('P2002')) {
          return;
        }

        this.logger.error(`❌ Prisma client error: ${msg}`);

        // E57P01 = Neon auto-suspend terminated all connections → reconnect
        if (e.message.includes('E57P01') || e.message.includes('terminating connection')) {
          this.logger.warn('🔄 Neon connection terminated — auto-reconnecting...');
          await this.reconnect();
        } else {
          captureError(new Error(`Prisma error: ${e.message}`));
        }
      });
    } catch {
      this.logger.warn('Prisma event monitoring not available on this client instance');
    }
  }
}
