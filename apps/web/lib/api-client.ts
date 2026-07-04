/**
 * @repo/api-client
 * 
 * Centralized HTTP API client for Auction 11 frontends.
 * Strictly uses NEXT_PUBLIC_API_URL — NEVER hardcodes localhost.
 */

function resolveApiUrl(): string {
    const url =
        process.env["NEXT_PUBLIC_API_URL"] ??
        (typeof window !== "undefined"
            ? window.location.origin
            : undefined);

    if (!url) {
        throw new Error(
            "[api-client] NEXT_PUBLIC_API_URL is not defined. Add it to your .env.local file."
        );
    }
    return url.replace(/\/$/, ""); // strip trailing slash
}

const BASE_URL = resolveApiUrl();

async function fetchJson<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        credentials: "include", // cross-subdomain cookie support
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

// ─── Auction Endpoints ────────────────────────────────────────────────────────

export const auctionApi = {
    /** Fetch upcoming / scheduled auctions (for landing page hero) */
    getUpcoming: () =>
        fetchJson<{
            id: string;
            title: string;
            coverImageURL: string;
            startTime: string;
            itemCount: number;
            estimatedValue: number;
        }[]>("/auctions?status=SCHEDULED&limit=6"),

    /** Fetch live auctions */
    getLive: () =>
        fetchJson<{
            id: string;
            title: string;
            coverImageURL: string;
            participantCount: number;
            currentHighestBid: number;
        }[]>("/auctions?status=LIVE"),

    /** Fetch recently ended auctions for social proof */
    getRecent: () =>
        fetchJson<{
            id: string;
            title: string;
            coverImageURL: string;
            totalRevenue: number;
            itemsSold: number;
        }[]>("/auctions?status=ENDED&limit=3"),
};

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export interface BlogArticle {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    url: string;
    publishedAt: string;
}

export interface BlogsResponse {
    data: BlogArticle[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export const blogsApi = {
    getBlogs: (page: number, limit: number) =>
        fetchJson<ApiResponse<BlogsResponse>>(`/blogs?page=${page}&limit=${limit}`),
};

export { fetchJson };
