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

export interface BlogCategoryItem {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    coverImage?: string;
    blogsCount?: number;
}

export interface BlogTagItem {
    id: string;
    name: string;
    slug: string;
    description?: string;
    blogsCount?: number;
}

export interface InternalBlogArticle {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt?: string;
    content: string;
    status: string;
    coverImage?: string;
    thumbnailImage?: string;
    heroImage?: string;
    readingTime: number;
    viewsCount: number;
    likesCount: number;
    isFeatured: boolean;
    isPinned: boolean;
    isTrending: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    author?: { id: string; name: string; profileUrl?: string; email?: string };
    categories: BlogCategoryItem[];
    tags: BlogTagItem[];
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
        canonicalUrl?: string;
        ogImage?: string;
    };
    jsonLd?: any;
}

export type BlogArticle = InternalBlogArticle;

export interface PublicBlogsResponse {
    data: {
        items: InternalBlogArticle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export const blogsApi = {
    getBlogs: (params?: { page?: number; limit?: number; search?: string; category?: string; tag?: string; featuredOnly?: boolean; trendingOnly?: boolean }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', String(params.page));
        if (params?.limit) queryParams.set('limit', String(params.limit));
        if (params?.search) queryParams.set('search', params.search);
        if (params?.category) queryParams.set('category', params.category);
        if (params?.tag) queryParams.set('tag', params.tag);
        if (params?.featuredOnly) queryParams.set('featuredOnly', 'true');
        if (params?.trendingOnly) queryParams.set('trendingOnly', 'true');

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return fetchJson<PublicBlogsResponse>(`/blogs${queryString}`);
    },
    getBlogBySlug: (slug: string) => fetchJson<InternalBlogArticle>(`/blogs/${slug}`),
    getCategories: () => fetchJson<BlogCategoryItem[]>('/blogs/categories'),
    getTags: () => fetchJson<BlogTagItem[]>('/blogs/tags'),
    recordView: (id: string) => fetchJson<{ success: boolean }>(`/blogs/${id}/view`, { method: 'POST' }),
    recordLike: (id: string) => fetchJson<{ likesCount: number }>(`/blogs/${id}/like`, { method: 'POST' }),
};

export { fetchJson };
