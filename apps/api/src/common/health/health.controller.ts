import { Controller, Get, Inject } from '@nestjs/common';
import type { Response } from 'express';
import { Res } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.provider';
import { PrismaService } from '../../prisma/prisma.service';
import { MetricsService } from '../monitoring/metrics.service';

interface HealthStatus {
    status: 'ok' | 'degraded';
    db: 'ok' | 'error';
    redis: 'ok' | 'error';
    eventLoopLagMs: number;
    memory: {
        heapUsedMb: number;
        heapTotalMb: number;
    };
    timestamp: string;
    uptime: number;
}

@Controller('api')
export class HealthController {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(REDIS_CLIENT) private readonly redis: Redis,
        private readonly metricsService: MetricsService,
    ) { }

    @Get('health')
    async check(@Res() res: Response): Promise<void> {
        // 1. Measure event loop lag
        const lagMs = await this.measureEventLoopLag();

        // 2. Check DB
        let dbStatus: 'ok' | 'error' = 'ok';
        try {
            await this.prisma.prisma.$queryRaw`SELECT 1`;
        } catch {
            dbStatus = 'error';
        }

        // 3. Check Redis
        let redisStatus: 'ok' | 'error' = 'ok';
        try {
            const pong = await this.redis.ping();
            if (pong !== 'PONG') redisStatus = 'error';
        } catch {
            redisStatus = 'error';
        }

        // 4. Update Redis memory metric
        try {
            const info = await this.redis.info('memory');
            const match = info.match(/used_memory:(\d+)/);
            if (match) this.metricsService.setRedisMemory(Number(match[1]));
        } catch {
            // non-critical
        }

        const mem = process.memoryUsage();
        const toMb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10;

        const body: HealthStatus = {
            status: dbStatus === 'ok' && redisStatus === 'ok' ? 'ok' : 'degraded',
            db: dbStatus,
            redis: redisStatus,
            eventLoopLagMs: lagMs,
            memory: {
                heapUsedMb: toMb(mem.heapUsed),
                heapTotalMb: toMb(mem.heapTotal),
            },
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
        };

        res.status(body.status === 'ok' ? 200 : 503).json(body);
    }

    /** GET /api/metrics — Prometheus scrape endpoint */
    @Get('metrics')
    async scrapeMetrics(@Res() res: Response): Promise<void> {
        res
            .header('Content-Type', this.metricsService.getContentType())
            .send(await this.metricsService.getMetrics());
    }

    private measureEventLoopLag(): Promise<number> {
        return new Promise((resolve) => {
            const start = process.hrtime.bigint();
            setImmediate(() => {
                const lag = Number(process.hrtime.bigint() - start) / 1_000_000;
                resolve(Math.round(lag * 10) / 10);
            });
        });
    }
}
