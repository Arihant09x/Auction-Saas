"use client";

import { useAuthStore } from "../../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { adminStatsApi, AdminAuction, AdminStats, AdminAnalytics } from "../../lib/admin-api";
import {
  Users,
  Layers,
  DollarSign,
  Radio,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import Link from "next/link";


function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
  delta,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href?: string;
  delta?: string;
}) {
  const content = (
    <div
      className={`group bg-white  border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${href ? "cursor-pointer hover:-translate-y-0.5" : ""
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#072460] transition-colors" />
        )}
      </div>
      <p className="text-3xl  font-black text-slate-900 tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
      {delta && (
        <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {delta}
        </p>
      )}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminOverviewPage() {
  const { firebaseToken, user } = useAuthStore();
  const userRole = (user as any)?.role as string;

  // ─── Queries ──────────────────────────────────────────────────────────────

  const { data: statsResponse, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminStatsApi.getStats(firebaseToken!),
    enabled: !!firebaseToken,
    refetchInterval: 30_000,
  });

  const { data: analyticsResponse, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["admin-analytics-overview"],
    queryFn: () => adminStatsApi.getAnalytics(firebaseToken!),
    enabled: !!firebaseToken,
  });

  const { data: liveResponse, isLoading: loadingLive } = useQuery({
    queryKey: ["admin-live-auctions"],
    queryFn: () => adminStatsApi.getLiveAuctions(firebaseToken!),
    enabled: !!firebaseToken,
    refetchInterval: 15_000,
  });

  // ─── Extract data from responses ─────────────────────────────────────────

  const stats: AdminStats | undefined = statsResponse?.data;
  const analytics: AdminAnalytics | undefined = analyticsResponse?.data;
  const liveAuctions: AdminAuction[] = liveResponse?.data || [];

  const shimmer = "animate-pulse bg-slate-200 rounded-xl";

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Overview Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, <span className="font-bold text-[#072460]">{(user as any)?.name || "Admin"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          Live updates every 30s
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${shimmer} h-32`} />
          ))
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={stats?.totalUsers ?? 0}
              icon={Users}
              color="bg-blue-50 text-blue-600"
              href="/admin/users"
              delta="+users this month"
            />
            <StatCard
              label="Total Auctions"
              value={stats?.totalAuctions ?? 0}
              icon={Layers}
              color="bg-purple-50 text-purple-600"
              href="/admin/auctions"
            />
            <StatCard
              label="Paid Auctions"
              value={stats?.totalPaidAuctions ?? 0}
              icon={DollarSign}
              color="bg-emerald-50 text-emerald-600"
              href="/admin/payments"
            />
            <StatCard
              label="Live Right Now"
              value={stats?.liveAuctions ?? 0}
              icon={Radio}
              color="bg-rose-50 text-rose-600"
              href="/admin/live"
              delta={stats?.liveAuctions ? "Active live sessions" : "No live auctions"}
            />
          </>
        )}
      </div>

      {/* ── Two-column: Auction Status + User Roles ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auctions by Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#072460]" /> Auctions by Status
          </h3>
          {loadingAnalytics ? (
            <div className={`${shimmer} h-32`} />
          ) : (
            <div className="space-y-3">
              {(analytics?.auctionsByStatus ?? []).map((item) => {
                const total = analytics?.summary.totalAuctions || 1;
                const pct = Math.round((item.count / total) * 100);
                const colors: Record<string, string> = {
                  LIVE: "bg-rose-500",
                  UPCOMING: "bg-blue-500",
                  COMPLETED: "bg-emerald-500",
                  DRAFT: "bg-slate-400",
                  ARCHIVED: "bg-slate-300",
                };
                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{item.status}</span>
                      <span className="text-slate-500">{item.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[item.status] || "bg-slate-400"} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Users by Role */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#072460]" /> Users by Role
          </h3>
          {loadingAnalytics ? (
            <div className={`${shimmer} h-32`} />
          ) : (
            <div className="space-y-2">
              {(analytics?.usersByRole ?? []).map((item) => {
                const roleColors: Record<string, string> = {
                  SUPER_ADMIN: "bg-purple-100 text-purple-700",
                  ADMIN: "bg-blue-100 text-blue-700",
                  MODERATOR: "bg-amber-100 text-amber-700",
                  SUPPORT: "bg-teal-100 text-teal-700",
                  CONTENT_EDITOR: "bg-pink-100 text-pink-700",
                  ANALYST: "bg-indigo-100 text-indigo-700",
                  USER: "bg-slate-100 text-slate-600",
                };
                return (
                  <div key={item.role} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${roleColors[item.role] || "bg-slate-100 text-slate-600"}`}>
                      {item.role}
                    </span>
                    <span className="text-sm font-black text-slate-800">{item.count.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Live Auctions Monitor ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            Live Auctions
          </h3>
          <Link
            href="/admin/live"
            className="text-xs font-bold text-[#072460] hover:underline flex items-center gap-1"
          >
            View Control Center <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingLive ? (
          <div className={`${shimmer} h-20`} />
        ) : liveAuctions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No live auctions at this moment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {liveAuctions.map((auction) => (
              <div key={auction.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{auction.name}</p>
                  <p className="text-xs text-slate-500">
                    By {auction.organizer?.name} · {auction._count?.teams ?? 0} teams · {auction._count?.players ?? 0} players
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> LIVE
                  </span>
                  <Link
                    href="/admin/live"
                    className="text-xs font-bold text-[#072460] bg-[#072460]/5 px-3 py-1.5 rounded-lg hover:bg-[#072460]/10 transition-all"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent Payments ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#072460]" /> Recent Payments
          </h3>
          <Link
            href="/admin/payments"
            className="text-xs font-bold text-[#072460] hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        {loadingAnalytics ? (
          <div className={`${shimmer} h-24`} />
        ) : !analytics?.recentPayments?.length ? (
          <p className="text-sm text-slate-400 text-center py-6">No payments yet</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {analytics.recentPayments.slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-xs font-bold text-slate-800">{p.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {p.organizer?.name} · {p.planTier}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span className="text-[10px] text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}