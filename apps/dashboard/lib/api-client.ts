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
