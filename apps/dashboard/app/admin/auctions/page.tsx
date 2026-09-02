"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { adminStatsApi, AdminAuction } from "../../../lib/admin-api";
import {
  Search,
  Layers,
  RefreshCw,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  LIVE: "bg-rose-100 text-rose-700",
  UPCOMING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  DRAFT: "bg-slate-100 text-slate-600",
  ARCHIVED: "bg-amber-100 text-amber-600",
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "bg-slate-50 text-slate-500",
  BASIC: "bg-blue-50 text-blue-600",
  STANDARD: "bg-indigo-50 text-indigo-600",
  PREMIUM: "bg-purple-50 text-purple-600",
  ELITE: "bg-amber-50 text-amber-700",
  ULTIMATE: "bg-rose-50 text-rose-600",
  MEGA: "bg-emerald-50 text-emerald-700",
};

export default function AdminAuctionsPage() {
  const { firebaseToken } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-all-auctions"],
    queryFn: () => adminStatsApi.getAllAuctions(firebaseToken!),
    enabled: !!firebaseToken,
  });

  // Extract the array from the response
  const auctions: AdminAuction[] = response?.data || [];

  const filtered = auctions.filter((a: AdminAuction) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.organizer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Auctions</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} of {auctions.length} auctions
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
            placeholder="Search auction or organizer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] font-medium"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer"
        >
          <option value="">All Statuses</option>
          {["DRAFT", "UPCOMING", "LIVE", "COMPLETED", "ARCHIVED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-[#072460] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading auctions…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No auctions found</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left font-bold text-slate-600">Auction</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Organizer</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Status</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Plan</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Paid</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((auction: AdminAuction) => (
                <tr key={auction.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-bold text-slate-900">{auction.name}</p>
                    <p className="text-slate-400 font-mono text-[10px] mt-0.5 truncate max-w-[180px]">
                      {auction.id.slice(0, 8)}…
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {/* Avatar: image if available, otherwise initials */}
                      {auction.organizer?.profileUrl ? (
                        <img
                          src={auction.organizer.profileUrl}
                          alt={auction.organizer.name || "Organizer"}
                          className="w-6 h-6 rounded-full object-cover bg-slate-100"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#072460]/10 text-[#072460] font-bold text-[9px] flex items-center justify-center">
                          {auction.organizer?.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{auction.organizer?.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{auction.organizer?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${STATUS_COLORS[auction.status] || "bg-slate-100 text-slate-500"}`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${PLAN_COLORS[auction.planTier] || "bg-slate-50 text-slate-500"}`}>
                      {auction.planTier}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {auction.isPaid ? (
                      <span className="text-emerald-600 font-bold">✓ Paid</span>
                    ) : (
                      <span className="text-slate-400">Free</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(auction.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}