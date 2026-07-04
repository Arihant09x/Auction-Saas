import { io, Socket } from "socket.io-client";
import type {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@repo/types";

// ─── Typed Socket ────────────────────────────────────────────────────────────

export type AuctionSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// ─── Connection Options ──────────────────────────────────────────────────────

export interface AuctionSocketOptions {
    /**
     * Explicit WebSocket URL override. Falls back to NEXT_PUBLIC_WS_URL env var.
     * NEVER hardcode localhost — always inject via environment variable.
     */
    url?: string;
    token: string;
    autoConnect?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
}

// ─── Env Resolution (strict — no hardcoded fallback) ─────────────────────────

/**
 * Resolves the WebSocket URL strictly from environment.
 * Throws at call-time if missing so misconfiguration is caught early.
 */
function resolveWsUrl(override?: string): string {
    const url =
        override ??
        (typeof window !== "undefined"
            ? (window as Record<string, unknown>)["__NEXT_PUBLIC_WS_URL__"] as string | undefined
            : undefined) ??
        // Set by Next.js — must be defined in .env.local
        (globalThis as Record<string, unknown>)["NEXT_PUBLIC_WS_URL"] as string | undefined;

    if (!url) {
        throw new Error(
            "[socket-client] NEXT_PUBLIC_WS_URL is not defined. " +
            "Add it to your .env.local file. Never hardcode the socket URL.",
        );
    }
    return url;
}

// ─── Singleton Registry ──────────────────────────────────────────────────────

const socketRegistry = new Map<string, AuctionSocket>();

// ─── Factory Function ────────────────────────────────────────────────────────

/**
 * Creates or returns a typed live auction socket connection.
 * Uses a singleton registry keyed by (url + token) to prevent duplicate connections.
 */
export function createAuctionSocket(opts: AuctionSocketOptions): AuctionSocket {
    const url = resolveWsUrl(opts.url);
    const cacheKey = `${url}::${opts.token}`;

    const existing = socketRegistry.get(cacheKey);
    if (existing && existing.connected) {
        return existing;
    }

    const socket: AuctionSocket = io(url, {
        auth: { token: opts.token },
        transports: ["websocket", "polling"],
        autoConnect: opts.autoConnect ?? true,
        reconnectionAttempts: opts.reconnectionAttempts ?? 5,
        reconnectionDelay: opts.reconnectionDelay ?? 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        withCredentials: true, // required for cross-subdomain session sharing
    });

    socketRegistry.set(cacheKey, socket);
    return socket;
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

export function destroyAuctionSocket(socket: AuctionSocket): void {
    socket.disconnect();
    socketRegistry.forEach((s, key) => {
        if (s === socket) socketRegistry.delete(key);
    });
}

export function destroyAllSockets(): void {
    socketRegistry.forEach((socket) => socket.disconnect());
    socketRegistry.clear();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function isSocketConnected(socket: AuctionSocket): boolean {
    return socket.connected;
}

export type { Socket } from "socket.io-client";
