"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi, AdminUser } from "../../../lib/admin-api";
import { toast } from "sonner";
import {
  Search,
  Users,
  ShieldOff,
  Ban,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  X,
  Clock,
  User,
  Shield,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
  ADMIN: "bg-blue-100 text-blue-700 border-blue-200",
  MODERATOR: "bg-amber-100 text-amber-700 border-amber-200",
  SUPPORT: "bg-teal-100 text-teal-700 border-teal-200",
  CONTENT_EDITOR: "bg-pink-100 text-pink-700 border-pink-200",
  ANALYST: "bg-indigo-100 text-indigo-700 border-indigo-200",
  USER: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SUSPENDED: "bg-amber-100 text-amber-700",
  BANNED: "bg-red-100 text-red-700",
};

const ALL_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "CONTENT_EDITOR", "ANALYST", "USER"];

export default function AdminUsersPage() {
  const { firebaseToken, user } = useAuthStore();
  const qc = useQueryClient();
  const actorRole = (user as any)?.role as string;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ id: string; name: string } | null>(null);
  const [newRole, setNewRole] = useState("");

  // ─── Users List ─────────────────────────────────────────────────────────────

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", page, search, roleFilter, statusFilter],
    queryFn: () =>
      adminUsersApi.getUsers(firebaseToken!, {
        page,
        limit: 20,
        search: search.trim() || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      }),
    enabled: !!firebaseToken,
  });

  const paginated = response?.data;
  const users = paginated?.items || [];
  const totalPages = paginated?.totalPages || 1;

  // ─── User Detail ──────────────────────────────────────────────────────────

  const { data: detailResponse, isLoading: loadingDetail } = useQuery({
    queryKey: ["admin-user-detail", detailUserId],
    queryFn: () => adminUsersApi.getUserDetail(firebaseToken!, detailUserId!),
    enabled: !!firebaseToken && !!detailUserId,
  });

  const detailUser = detailResponse?.data;

  // ─── Mutations ────────────────────────────────────────────────────────────

  const mutOpts = (label: string) => ({
    onSuccess: () => {
      toast.success(label);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      if (detailUserId) qc.invalidateQueries({ queryKey: ["admin-user-detail", detailUserId] });
    },
    onError: (err: any) => toast.error(err.message || "Action failed"),
  });

  const suspendMut = useMutation({
    mutationFn: (id: string) => adminUsersApi.suspendUser(firebaseToken!, id),
    ...mutOpts("User suspended"),
  });
  const banMut = useMutation({
    mutationFn: (id: string) => adminUsersApi.banUser(firebaseToken!, id),
    ...mutOpts("User banned"),
  });
  const restoreMut = useMutation({
    mutationFn: (id: string) => adminUsersApi.restoreUser(firebaseToken!, id),
    ...mutOpts("User restored to ACTIVE"),
  });
  const resetMut = useMutation({
    mutationFn: (id: string) => adminUsersApi.resetSession(firebaseToken!, id),
    ...mutOpts("Session reset — user will be logged out"),
  });
  const roleMut = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminUsersApi.changeRole(firebaseToken!, id, role),
    onSuccess: () => {
      toast.success("Role changed");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setRoleChangeTarget(null);
    },
    onError: (err: any) => toast.error(err.message || "Role change failed"),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {paginated?.total ?? "—"} users total
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, mobile…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] font-medium"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer"
        >
          <option value="">All Roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="BANNED">BANNED</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-[#072460] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading users…</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No users found</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left font-bold text-slate-600">User</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Role</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Status</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Auctions</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Joined</th>
                <th className="px-5 py-3 text-right font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u: AdminUser) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#072460]/10 text-[#072460] font-bold text-xs flex items-center justify-center shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{u.name}</p>
                        <p className="text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-md border font-bold text-[10px] ${ROLE_COLORS[u.role] || "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-md font-bold text-[10px] ${STATUS_COLORS[u.status] || "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-slate-600">{u._count?.auctions ?? 0}</td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDetailUserId(u.id)}
                        title="View Details"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {u.status === "ACTIVE" && (
                        <button
                          onClick={() => {
                            if (confirm(`Suspend ${u.name}?`)) suspendMut.mutate(u.id);
                          }}
                          title="Suspend"
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 cursor-pointer"
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {u.status !== "BANNED" && (
                        <button
                          onClick={() => {
                            if (confirm(`Ban ${u.name}? This is a serious action.`)) banMut.mutate(u.id);
                          }}
                          title="Ban"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(u.status === "SUSPENDED" || u.status === "BANNED") && (
                        <button
                          onClick={() => restoreMut.mutate(u.id)}
                          title="Restore to ACTIVE"
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Force logout ${u.name}?`)) resetMut.mutate(u.id);
                        }}
                        title="Reset Session"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setRoleChangeTarget({ id: u.id, name: u.name });
                          setNewRole(u.role);
                        }}
                        title="Change Role"
                        className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── User Detail Drawer ─────────────────────────────────────────────── */}
      {detailUserId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
          onClick={() => setDetailUserId(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">User Details</h3>
              <button
                onClick={() => setDetailUserId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {loadingDetail ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-7 h-7 border-4 border-[#072460] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : detailUser ? (
              <div className="p-5 space-y-5">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#072460]/10 text-[#072460] font-black text-xl flex items-center justify-center">
                    {detailUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{detailUser.name}</h4>
                    <p className="text-xs text-slate-500">{detailUser.email}</p>
                    {detailUser.mobile && (
                      <p className="text-xs text-slate-400">{detailUser.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Role & Status badges */}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${ROLE_COLORS[detailUser.role] || ""
                      }`}
                  >
                    {detailUser.role}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[detailUser.status] || ""
                      }`}
                  >
                    {detailUser.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-2xl font-black text-slate-900">
                      {detailUser._count?.auctions ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      Auctions Created
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-2xl font-black text-slate-900">
                      {detailUser._count?.joinedAuctions ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      Auctions Joined
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  {[
                    { label: "City", value: detailUser.city },
                    {
                      label: "Joined",
                      value: new Date(detailUser.createdAt).toLocaleDateString("en-IN", {
                        dateStyle: "long",
                      }),
                    },
                  ]
                    .filter((i) => i.value)
                    .map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-slate-50">
                        <span className="text-xs font-semibold text-slate-500">{label}</span>
                        <span className="text-xs font-bold text-slate-800">{value}</span>
                      </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {detailUser.status === "ACTIVE" && (
                      <button
                        onClick={() => {
                          suspendMut.mutate(detailUser.id);
                          setDetailUserId(null);
                        }}
                        className="py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl hover:bg-amber-100 cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                    {detailUser.status !== "BANNED" && (
                      <button
                        onClick={() => {
                          banMut.mutate(detailUser.id);
                          setDetailUserId(null);
                        }}
                        className="py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 cursor-pointer"
                      >
                        Ban
                      </button>
                    )}
                    {(detailUser.status === "SUSPENDED" || detailUser.status === "BANNED") && (
                      <button
                        onClick={() => {
                          restoreMut.mutate(detailUser.id);
                          setDetailUserId(null);
                        }}
                        className="py-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-100 cursor-pointer"
                      >
                        Restore
                      </button>
                    )}
                    <button
                      onClick={() => {
                        resetMut.mutate(detailUser.id);
                      }}
                      className="py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Force Logout
                    </button>
                  </div>
                </div>

                {/* Login History */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Recent Login History
                  </p>
                  {detailUser.loginHistories?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      No login history recorded
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {detailUser.loginHistories?.slice(0, 10).map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl text-xs"
                        >
                          <div>
                            <p className="font-semibold text-slate-700">
                              {entry.ipAddress || "Unknown IP"}
                            </p>
                            <p className="text-slate-400 text-[10px]">
                              {entry.device || "Unknown device"}
                            </p>
                          </div>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ── Role Change Modal ──────────────────────────────────────────────── */}
      {roleChangeTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Change Role</h3>
            <p className="text-xs text-slate-500 mb-4">
              For: <strong>{roleChangeTarget.name}</strong>
            </p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer mb-4"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {newRole === "SUPER_ADMIN" && actorRole !== "SUPER_ADMIN" && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
                Only a SUPER_ADMIN can grant the SUPER_ADMIN role.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setRoleChangeTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  roleMut.mutate({ id: roleChangeTarget.id, role: newRole })
                }
                disabled={
                  roleMut.isPending ||
                  (newRole === "SUPER_ADMIN" && actorRole !== "SUPER_ADMIN")
                }
                className="flex-1 py-2.5 bg-[#072460] text-white rounded-xl text-sm font-bold hover:bg-[#0a307f] disabled:opacity-50 cursor-pointer"
              >
                {roleMut.isPending ? "Changing…" : "Change Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}