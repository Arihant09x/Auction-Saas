"use client";

import { useAuthStore } from "../../../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { adminStatsApi, AdminAuction } from "../../../lib/admin-api";
import {
  Radio,
  Zap,
  Users,
  Layers,
  RefreshCw,
  Activity,
  Clock,
  Signal,
} from "lucide-react";

export default function AdminLiveControlPage() {
  const { firebaseToken } = useAuthStore();

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-live-control"],
    queryFn: () => adminStatsApi.getLiveAuctions(firebaseToken!),
    enabled: !!firebaseToken,
    refetchInterval: 10_000, // poll every 10s for live data
  });

  // Extract the array from the response
  const liveAuctions: AdminAuction[] = response?.data || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Live Control Center</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {liveAuctions.length} live session{liveAuctions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            Auto-refresh 10s
          </div>
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Live Auctions */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl h-48" />
          ))}
        </div>
      ) : liveAuctions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Radio className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-400 mb-1">No Live Auctions</h3>
          <p className="text-sm text-slate-400">
            When an auction goes live, it will appear here with real-time controls.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-slate-900 truncate">
                    {auction.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Organized by{" "}
                    <span className="font-bold text-slate-700">{auction.organizer?.name}</span>
                  </p>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full border border-rose-100 shrink-0">
                  <Zap className="w-2.5 h-2.5" /> LIVE
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <Users className="w-4 h-4 text-[#072460] mx-auto mb-1" />
                  <p className="text-lg font-black text-slate-900">{auction._count?.teams ?? 0}</p>
                  <p className="text-[9px] text-slate-500 font-semibold">Teams</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <Layers className="w-4 h-4 text-[#072460] mx-auto mb-1" />
                  <p className="text-lg font-black text-slate-900">{auction._count?.players ?? 0}</p>
                  <p className="text-[9px] text-slate-500 font-semibold">Players</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <Signal className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-lg font-black text-emerald-600">●</p>
                  <p className="text-[9px] text-slate-500 font-semibold">Connected</p>
                </div>
              </div>

              {/* Contact & Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Started {new Date(auction.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="font-mono">{auction.organizer?.email}</span>
              </div>

              {/* Action hint */}
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <p className="text-[10px] text-amber-700 font-semibold">
                  🔧 Full WebSocket-based live control (pause/resume/kick/override) requires integration with the live-auction gateway.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="bg-gradient-to-br from-[#072460] to-[#0a307f] text-white rounded-2xl p-6">
        <h3 className="text-sm font-bold mb-2">Live Auction Control Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Join as invisible observer",
            "View / remove / block bidders",
            "Pause / Resume / End auction",
            "Extend timer, override bid",
            "Change winner",
            "Broadcast messages",
            "Monitor WebSocket health",
            "Track participant count",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-2 p-2 bg-white/10 rounded-xl text-xs text-white/80"
            >
              <Zap className="w-3 h-3 text-[#ffba00] shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/50 mt-3">
          These features will connect to the live-auction.gateway.ts WebSocket server when integrated.
        </p>
      </div>
    </div>
  );
}