"use client";

import { useAuthStore } from "../../../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { adminStatsApi, AdminPayment } from "../../../lib/admin-api";
import {
  DollarSign,
  RefreshCw,
  Clock,
  CreditCard,
  TrendingUp,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const { firebaseToken } = useAuthStore();

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-all-payments"],
    queryFn: () => adminStatsApi.getAllPayments(firebaseToken!),
    enabled: !!firebaseToken,
  });

  // Extract the array
  const payments: AdminPayment[] = response?.data || [];

  // Derived stats
  const verifiedCount = payments.filter((p) => p.razorpayPaymentId).length;
  const planTiersUsed = new Set(payments.map((p) => p.planTier)).size;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {payments.length} paid auctions
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            {payments.length}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total Paid Auctions</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            {verifiedCount}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Razorpay Verified</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            {planTiersUsed}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Plan Tiers Used</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-[#072460] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading payments…</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No payments recorded</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left font-bold text-slate-600">Auction</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Organizer</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Plan</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Razorpay ID</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-bold text-slate-900">{p.name}</td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-700">{p.organizer?.name}</p>
                    <p className="text-[10px] text-slate-400">{p.organizer?.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-bold text-[10px]">
                      {p.planTier}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-slate-500">
                      {p.razorpayPaymentId || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
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