import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

/**
 * MetricsService — Business & Infrastructure Metrics
 *
 * Exposes Prometheus-compatible metrics at GET /metrics.
 * Instruments: bids, auctions, players, WS connections, Redis memory.
 *
 * Consumed by Prometheus → Grafana, or exported to New Relic via prom-remote-write.
 */
@Injectable()
export class MetricsService {
    // ─── Counters (monotonically increasing) ────────────────────────────────
    private readonly bidPlaced: client.Counter;
    private readonly playerSold: client.Counter;
    private readonly auctionStarted: client.Counter;
    private readonly auctionEnded: client.Counter;

    // ─── Gauges (point-in-time values) ──────────────────────────────────────
    private readonly activeLiveAuctions: client.Gauge;
    private readonly wsConnectionsActive: client.Gauge;
    private readonly redisUnsoldQueueLength: client.Gauge;
    private readonly redisMemoryUsedBytes: client.Gauge;

    // ─── Histograms (latency distributions) ─────────────────────────────────
    private readonly bidLatencyMs: client.Histogram;
    private readonly dbQueryLatencyMs: client.Histogram;
    private readonly httpRequestDurationMs: client.Histogram;

    constructor() {
        // Use the default registry (auto-includes Node.js default metrics)
        const register = client.register;
        client.collectDefaultMetrics({ register });

        // ── Counters ──────────────────────────────────────────────────────────
        this.bidPlaced = new client.Counter({
            name: 'auction_bid_placed_total',
            help: 'Total number of bids placed across all auctions',
            labelNames: ['auction_id'],
        });

        this.playerSold = new client.Counter({
            name: 'auction_player_sold_total',
            help: 'Total number of players sold (confirmed)',
            labelNames: ['auction_id'],
        });

        this.auctionStarted = new client.Counter({
            name: 'auction_started_total',
            help: 'Total number of live auctions initialized',
        });

        this.auctionEnded = new client.Counter({
            name: 'auction_ended_total',
            help: 'Total number of auctions ended',
            labelNames: ['forced'],
        });

        // ── Gauges ────────────────────────────────────────────────────────────
        this.activeLiveAuctions = new client.Gauge({
            name: 'auction_active_live_total',
            help: 'Number of currently LIVE auctions (Redis-tracked)',
        });

        this.wsConnectionsActive = new client.Gauge({
            name: 'ws_connections_active',
            help: 'Active WebSocket connections to the live-auction namespace',
        });

        this.redisUnsoldQueueLength = new client.Gauge({
            name: 'redis_unsold_queue_length',
            help: 'Number of players remaining in Redis unsold queue',
            labelNames: ['auction_id'],
        });

        this.redisMemoryUsedBytes = new client.Gauge({
            name: 'redis_memory_used_bytes',
            help: 'Redis used_memory reported by INFO',
        });

        // ── Histograms ────────────────────────────────────────────────────────
        this.bidLatencyMs = new client.Histogram({
            name: 'auction_bid_latency_ms',
            help: 'End-to-end latency of atomicPlaceBid Lua script (ms)',
            buckets: [5, 10, 20, 50, 100, 200, 500],
        });

        this.dbQueryLatencyMs = new client.Histogram({
            name: 'db_query_duration_ms',
            help: 'Prisma query execution time (ms)',
            labelNames: ['operation', 'model'],
            buckets: [10, 50, 100, 200, 500, 1000, 2000],
        });

        this.httpRequestDurationMs = new client.Histogram({
            name: 'http_request_duration_ms',
            help: 'HTTP request duration (ms)',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [10, 50, 100, 200, 500, 1000],
        });
    }

    // ─── Public API ──────────────────────────────────────────────────────────
    recordBidPlaced(auctionId: string): void {
        this.bidPlaced.inc({ auction_id: auctionId });
    }

    recordPlayerSold(auctionId: string): void {
        this.playerSold.inc({ auction_id: auctionId });
    }

    recordAuctionStarted(): void {
        this.auctionStarted.inc();
        this.activeLiveAuctions.inc();
    }

    recordAuctionEnded(forced = false): void {
        this.auctionEnded.inc({ forced: String(forced) });
        this.activeLiveAuctions.dec();
    }

    setWsConnections(count: number): void {
        this.wsConnectionsActive.set(count);
    }

    setRedisUnsoldQueue(auctionId: string, length: number): void {
        this.redisUnsoldQueueLength.set({ auction_id: auctionId }, length);
    }

    setRedisMemory(bytes: number): void {
        this.redisMemoryUsedBytes.set(bytes);
    }

    /** Wrap a bid placement and auto-record latency */
    async measureBidLatency<T>(fn: () => Promise<T>): Promise<T> {
        const end = this.bidLatencyMs.startTimer();
        try {
            return await fn();
        } finally {
            end();
        }
    }

    /** Record Prisma query duration */
    recordDbQuery(model: string, operation: string, durationMs: number): void {
        this.dbQueryLatencyMs.observe({ model, operation }, durationMs);
    }

    /** Record HTTP request duration */
    recordHttpRequest(
        method: string,
        route: string,
        statusCode: number,
        durationMs: number,
    ): void {
        this.httpRequestDurationMs.observe(
            { method, route, status_code: String(statusCode) },
            durationMs,
        );
    }

    /** Return raw Prometheus text for GET /metrics */
    async getMetrics(): Promise<string> {
        return client.register.metrics();
    }

    getContentType(): string {
        return client.register.contentType;
    }
}
