"use client";

import { useAuthStore } from "../../../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { adminUsersApi, AdminUser } from "../../../lib/admin-api";
import {
  Building2,
  Search,
  RefreshCw,
  Layers,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useState } from "react";

export default function AdminOrganizersPage() {
  const { firebaseToken } = useAuthStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch all users then filter to those with at least 1 auction
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-organizers", page, search],
    queryFn: () =>
      adminUsersApi.getUsers(firebaseToken!, {
        page,
        limit: 50,
        search: search.trim() || undefined,
      }),
    enabled: !!firebaseToken,
  });

  // Extract the paginated result
  const paginated = response?.data;
  const organizers = (paginated?.items || []).filter(
    (u: AdminUser) => (u._count?.auctions ?? 0) > 0,
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Organizers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {organizers.length} of {paginated?.total ?? 0} organizers
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search organizers…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#072460] font-medium"
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl h-36" />
          ))}
        </div>
      ) : organizers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">No organizers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizers.map((org: AdminUser) => (
            <div
              key={org.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#072460]/10 text-[#072460] font-black text-sm flex items-center justify-center">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{org.name}</p>
                  <p className="text-xs text-slate-400 truncate">{org.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <Layers className="w-3.5 h-3.5 text-[#072460] mx-auto mb-0.5" />
                  <p className="text-base font-black text-slate-900">{org._count?.auctions ?? 0}</p>
                  <p className="text-[9px] text-slate-500 font-semibold">Auctions</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                  <p className="text-[10px] font-bold text-slate-700">
                    {new Date(org.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                  <p className="text-[9px] text-slate-500 font-semibold">Joined</p>
                </div>
              </div>
              {org.mobile && (
                <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-50 pt-2">
                  📱 {org.mobile}
                  {org.city ? ` · 📍 ${org.city}` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}