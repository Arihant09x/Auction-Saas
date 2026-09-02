// lib/admin-api.ts
// Shared API client for all admin endpoints beyond CMS

function resolveApiUrl(): string {
  const url = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3000';
  return url.replace(/\/$/, '');
}

const BASE_URL = resolveApiUrl();

// ─── Generic Response Wrapper ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Base fetch function ───────────────────────────────────────────────────

async function fetchAdmin<T>(
  path: string,
  token: string,
  options?: RequestInit,
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

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  city?: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  profileUrl?: string;
  createdAt: string;
  deletedAt?: string | null;
  _count?: { auctions: number };
}

export interface AdminUserDetail extends AdminUser {
  loginHistories: LoginHistoryEntry[];
  _count: { auctions: number; joinedAuctions: number };
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  ipAddress?: string;
  device?: string;
  createdAt: string;
}

export interface PaginatedUsers {
  items: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  endpoint: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  targetEntity?: string;
  targetId?: string;
  previousValue?: any;
  newValue?: any;
  createdAt: string;
  user?: { id: string; name: string; email: string; role: string };
}

export interface PaginatedAuditLogs {
  items: AuditLogEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAuctions: number;
  totalPlayers: number;
  totalPaidAuctions: number;
  liveAuctions: number;
}

export interface AdminAnalytics {
  summary: { totalUsers: number; totalAuctions: number; totalPaidAuctions: number };
  auctionsByStatus: Array<{ status: string; count: number }>;
  planDistribution: Array<{ plan: string; count: number }>;
  usersByRole: Array<{ role: string; count: number }>;
  recentPayments: any[];
}

// ─── Correct Auction Type ──────────────────────────────────────────────────

export interface AdminAuction {
  id: string;
  name: string;
  status: string;
  planTier: string;
  isPaid: boolean;
  createdAt: string;
  organizer: {
    name: string;
    email: string;
    mobile?: string;
    profileUrl?: string;
  };
  _count?: { teams: number; players: number };
}

export interface AdminPayment {
  id: string;
  name: string; // auction name
  planTier: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  organizer: {
    name: string;
    email: string;
    profileUrl?: string;
  };
}


// ─── Users API ───────────────────────────────────────────────────────────────

export const adminUsersApi = {
  getUsers: (
    token: string,
    params?: { page?: number; limit?: number; search?: string; role?: string; status?: string },
  ): Promise<ApiResponse<PaginatedUsers>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    if (params?.role) q.set('role', params.role);
    if (params?.status) q.set('status', params.status);
    return fetchAdmin<ApiResponse<PaginatedUsers>>(`/admin/users?${q}`, token);
  },

  getUserDetail: (token: string, id: string): Promise<ApiResponse<AdminUserDetail>> =>
    fetchAdmin<ApiResponse<AdminUserDetail>>(`/admin/user/${id}`, token),

  getLoginHistory: (token: string, id: string, limit = 30): Promise<ApiResponse<LoginHistoryEntry[]>> =>
    fetchAdmin<ApiResponse<LoginHistoryEntry[]>>(`/admin/user/${id}/login-history?limit=${limit}`, token),

  suspendUser: (token: string, id: string): Promise<ApiResponse<{ message: string }>> =>
    fetchAdmin<ApiResponse<{ message: string }>>(`/admin/user/${id}/suspend`, token, { method: 'POST' }),

  banUser: (token: string, id: string): Promise<ApiResponse<{ message: string }>> =>
    fetchAdmin<ApiResponse<{ message: string }>>(`/admin/user/${id}/ban`, token, { method: 'POST' }),

  restoreUser: (token: string, id: string): Promise<ApiResponse<{ message: string }>> =>
    fetchAdmin<ApiResponse<{ message: string }>>(`/admin/user/${id}/restore`, token, { method: 'POST' }),

  resetSession: (token: string, id: string): Promise<ApiResponse<{ message: string }>> =>
    fetchAdmin<ApiResponse<{ message: string }>>(`/admin/user/${id}/reset-session`, token, { method: 'POST' }),

  changeRole: (token: string, id: string, role: string): Promise<ApiResponse<{ message: string }>> =>
    fetchAdmin<ApiResponse<{ message: string }>>(`/admin/user/${id}/role`, token, {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  deleteUser: (token: string, id: string): Promise<ApiResponse<{ message: string }>> =>
    fetchAdmin<ApiResponse<{ message: string }>>(`/admin/user/${id}`, token, { method: 'DELETE' }),
};

// ─── Audit API ────────────────────────────────────────────────────────────────

export const adminAuditApi = {
  getLogs: (
    token: string,
    params?: { page?: number; limit?: number },
  ): Promise<ApiResponse<PaginatedAuditLogs>> => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    return fetchAdmin<ApiResponse<PaginatedAuditLogs>>(`/audit?${q}`, token);
  },

  undoAction: (token: string, logId: string): Promise<ApiResponse<{ undone: boolean; restored: any }>> =>
    fetchAdmin<ApiResponse<{ undone: boolean; restored: any }>>(`/audit/${logId}/undo`, token, {
      method: 'POST',
    }),

  deleteLog: (token: string, logId: string): Promise<ApiResponse<any>> =>
    fetchAdmin<ApiResponse<any>>(`/audit/${logId}`, token, { method: 'DELETE' }),
};

// ─── Stats & Analytics API ────────────────────────────────────────────────────

export const adminStatsApi = {
  getStats: (token: string): Promise<ApiResponse<AdminStats>> =>
    fetchAdmin<ApiResponse<AdminStats>>('/admin/stats', token),

  getAnalytics: (token: string): Promise<ApiResponse<AdminAnalytics>> =>
    fetchAdmin<ApiResponse<AdminAnalytics>>('/admin/analytics', token),

  getLiveAuctions: (token: string): Promise<ApiResponse<AdminAuction[]>> =>
    fetchAdmin<ApiResponse<AdminAuction[]>>('/admin/live-auctions', token),

  getAllAuctions: (token: string): Promise<ApiResponse<AdminAuction[]>> =>
    fetchAdmin<ApiResponse<AdminAuction[]>>('/admin/auctions', token),

  getAllPayments: (token: string): Promise<ApiResponse<AdminPayment[]>> =>
    fetchAdmin<ApiResponse<AdminPayment[]>>('/admin/payments', token),
};