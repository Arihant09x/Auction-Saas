// admin-blogs-api.ts

function resolveApiUrl(): string {
  const url = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3000';
  return url.replace(/\/$/, '');
}

const BASE_URL = resolveApiUrl();

async function fetchAdminJson<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Helper to unwrap { success, data, ... } responses
function unwrapData<T>(response: any): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }
  return response as T;
}

// ---------- Interfaces (unchanged) ----------
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  coverImage?: string;
  blogsCount?: number;
}

export interface AdminTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  blogsCount?: number;
}

export interface AdminBlogRevision {
  id: string;
  revisionNum: number;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  createdBy?: string;
  createdAt: string;
}

export interface AdminBlogArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  coverImage?: string;
  thumbnailImage?: string;
  heroImage?: string;
  readingTime: number;
  viewsCount: number;
  likesCount: number;
  isFeatured: boolean;
  isPinned: boolean;
  isTrending: boolean;
  allowComments: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string; profileUrl?: string; email?: string };
  categories: AdminCategory[];
  tags: AdminTag[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  revisions?: AdminBlogRevision[];
  revisionsCount?: number;
}

export interface AdminBlogResponse {
  items: AdminBlogArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MediaItem {
  id: string;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  altText?: string;
  caption?: string;
  createdAt: string;
}

export interface MediaResponse {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsResponse {
  overview: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    scheduledBlogs: number;
    totalViews: number;
    totalLikes: number;
  };
  topCategories: Array<{ id: string; name: string; slug: string; count: number }>;
  topArticles: Array<{ id: string; title: string; slug: string; viewsCount: number; likesCount: number; publishedAt?: string }>;
  recentViews: Array<{ id: string; viewedAt: string; blog?: { title: string; slug: string } }>;
}

// ---------- API object ----------
export const adminBlogsApi = {
  // Analytics
  getAnalytics: async (token: string) => {
    const response = await fetchAdminJson<{ success: boolean; data: AnalyticsResponse }>(
      '/blogs/admin/analytics',
      token
    );
    return response.data;
  },

  // Admin blogs list
  getAdminBlogs: async (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<AdminBlogResponse> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);
    if (params?.status) q.set('status', params.status);
    if (params?.sortBy) q.set('sortBy', params.sortBy);
    if (params?.sortOrder) q.set('sortOrder', params.sortOrder);

    const queryStr = q.toString() ? `?${q.toString()}` : '';
    const response = await fetchAdminJson<{
      success: boolean;
      data: AdminBlogResponse;
      message?: string;
    }>(`/blogs/admin/list${queryStr}`, token);

    return response.data;
  },

  // Single blog
  getAdminBlogById: async (token: string, id: string): Promise<AdminBlogArticle> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminBlogArticle }>(
      `/blogs/admin/${id}`,
      token
    );
    return response.data;
  },

  // Create
  createBlog: async (token: string, data: any): Promise<AdminBlogArticle> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminBlogArticle }>(
      '/blogs/admin',
      token,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  // Update
  updateBlog: async (token: string, id: string, data: any): Promise<AdminBlogArticle> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminBlogArticle }>(
      `/blogs/admin/${id}`,
      token,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  // Delete
  deleteBlog: (token: string, id: string) =>
    fetchAdminJson<{ success: boolean; message: string }>(`/blogs/admin/${id}`, token, {
      method: 'DELETE',
    }),

  // Duplicate
  duplicateBlog: async (token: string, id: string): Promise<AdminBlogArticle> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminBlogArticle }>(
      `/blogs/admin/${id}/duplicate`,
      token,
      { method: 'POST' }
    );
    return response.data;
  },

  // Rollback revision
  rollbackRevision: async (token: string, id: string, revisionId: string): Promise<AdminBlogArticle> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminBlogArticle }>(
      `/blogs/admin/${id}/revert/${revisionId}`,
      token,
      { method: 'POST' }
    );
    return response.data;
  },

  // Bulk status
  bulkUpdateStatus: (token: string, ids: string[], status: string) =>
    fetchAdminJson<{ success: boolean; count: number }>('/blogs/admin/bulk/status', token, {
      method: 'PATCH',
      body: JSON.stringify({ ids, status }),
    }),

  // Bulk delete
  bulkDelete: (token: string, ids: string[]) =>
    fetchAdminJson<{ success: boolean; count: number }>('/blogs/admin/bulk/delete', token, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  // ----- Categories (public) -----
  getCategories: async (): Promise<AdminCategory[]> => {
    const res = await fetch(`${BASE_URL}/blogs/categories`);
    const json = await res.json();
    return unwrapData<AdminCategory[]>(json);
  },

  // ----- Tags (public) -----
  getTags: async (): Promise<AdminTag[]> => {
    const res = await fetch(`${BASE_URL}/blogs/tags`);
    const json = await res.json();
    return unwrapData<AdminTag[]>(json);
  },

  // Admin category CRUD
  createCategory: async (token: string, data: any): Promise<AdminCategory> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminCategory }>(
      '/blogs/admin/categories',
      token,
      { method: 'POST', body: JSON.stringify(data) }
    );
    return response.data;
  },

  updateCategory: async (token: string, id: string, data: any): Promise<AdminCategory> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminCategory }>(
      `/blogs/admin/categories/${id}`,
      token,
      { method: 'PUT', body: JSON.stringify(data) }
    );
    return response.data;
  },

  deleteCategory: (token: string, id: string) =>
    fetchAdminJson<any>(`/blogs/admin/categories/${id}`, token, { method: 'DELETE' }),

  // Admin tag CRUD
  createTag: async (token: string, data: any): Promise<AdminTag> => {
    const response = await fetchAdminJson<{ success: boolean; data: AdminTag }>(
      '/blogs/admin/tags',
      token,
      { method: 'POST', body: JSON.stringify(data) }
    );
    return response.data;
  },

  deleteTag: (token: string, id: string) =>
    fetchAdminJson<any>(`/blogs/admin/tags/${id}`, token, { method: 'DELETE' }),

  // ----- Media -----
  getMediaList: async (token: string, page = 1, limit = 20, search?: string): Promise<MediaResponse> => {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) q.set('search', search);
    const response = await fetchAdminJson<{ success: boolean; data: MediaResponse }>(
      `/blogs/admin/media/list?${q.toString()}`,
      token
    );
    return response.data;
  },

  uploadMedia: async (token: string, base64: string, altText?: string, caption?: string): Promise<MediaItem> => {
    const response = await fetchAdminJson<{ success: boolean; data: MediaItem }>(
      '/blogs/admin/media/upload',
      token,
      { method: 'POST', body: JSON.stringify({ base64, altText, caption }) }
    );
    return response.data;
  },

  deleteMedia: (token: string, id: string) =>
    fetchAdminJson<any>(`/blogs/admin/media/${id}`, token, { method: 'DELETE' }),

  // ----- AI Assistant -----
  generateAiDraft: async (token: string, dto: any) => {
    const response = await fetchAdminJson<{ success: boolean; data: any }>(
      '/blogs/admin/ai/generate-draft',
      token,
      { method: 'POST', body: JSON.stringify(dto) }
    );
    return response.data;
  },

  suggestSeo: async (token: string, dto: any) => {
    const response = await fetchAdminJson<{ success: boolean; data: any }>(
      '/blogs/admin/ai/suggest-seo',
      token,
      { method: 'POST', body: JSON.stringify(dto) }
    );
    return response.data;
  },

  summarizeContent: async (token: string, content: string) => {
    const response = await fetchAdminJson<{ success: boolean; data: { summary: string } }>(
      '/blogs/admin/ai/summarize',
      token,
      { method: 'POST', body: JSON.stringify({ content }) }
    );
    return response.data;
  },
};