// api-client.ts

function resolveApiUrl(): string {
    const url =
        process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3000";
    return url.replace(/\/$/, ""); // strip trailing slash
}

const BASE_URL = resolveApiUrl();

async function fetchJson<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
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

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

// ✅ MATCH the shape that your component actually uses
export interface BlogArticle {
    id: string;
    title: string;
    description?: string;
    url: string;          // /blog/{slug}
    imageUrl: string;     // coverImage or thumbnailImage or fallback
    publishedAt: string;  // ISO date
}

// ✅ Backend response shape
export interface BlogsResponse {
    items: any[];          // raw backend items
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const blogsApi = {
    getBlogs: async (params: { page: number; limit: number }) => {
        const response = await fetchJson<ApiResponse<BlogsResponse>>(
            `/blogs?page=${params.page}&limit=${params.limit}`
        );
        // response.data = { items, total, page, limit, totalPages }
        const data = response.data;
        if (!data) {
            throw new Error("No data in response");
        }
        // Map to component's BlogArticle shape
        const items = (data.items || []).map((article: any) => ({
            id: article.id,
            title: article.title,
            url: `/blog/${article.slug}`,
            imageUrl: article.coverImage || article.thumbnailImage || "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200",
            publishedAt: article.publishedAt,
        }));
        return {
            items,
            total: data.total || 0,
            page: data.page || 1,
            limit: data.limit || 6,
            totalPages: data.totalPages || 1,
        };
    },
};