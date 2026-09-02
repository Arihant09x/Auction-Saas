"use client";

import { useAuthStore } from "../../../store/auth.store";
import {
  Activity,
  Server,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Cpu,
  Clock,
} from "lucide-react";

export default function AdminOperationsPage() {
  const { user } = useAuthStore();
  const userRole = (user as any)?.role as string;

  if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700 mb-1">Access Restricted</h2>
          <p className="text-sm text-slate-500">
            Operations dashboard requires ADMIN or SUPER_ADMIN access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Operations</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            System health, background jobs, and infrastructure status
          </p>
        </div>
        <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600">Refresh Status</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* API Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Core API</h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Latency</span>
              <span className="font-mono font-bold text-slate-700">45ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Uptime</span>
              <span className="font-mono font-bold text-slate-700">99.99%</span>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Neon PostgreSQL</h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Pool Usage</span>
              <span className="font-mono font-bold text-slate-700">12/30</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Latency</span>
              <span className="font-mono font-bold text-slate-700">18ms</span>
            </div>
          </div>
        </div>

        {/* WebSocket / Redis Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Gateway</h3>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Active
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Active Sockets</span>
              <span className="font-mono font-bold text-slate-700">0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Redis Memory</span>
              <span className="font-mono font-bold text-slate-700">14MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-[10px] text-amber-700 font-semibold text-center">
          ⚠️ Operations dashboard uses mock data. Backend health check endpoints will be integrated in a future release.
        </p>
      </div>
    </div>
  );
}
