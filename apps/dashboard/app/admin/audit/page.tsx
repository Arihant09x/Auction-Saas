"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAuditApi, AuditLogEntry } from "../../../lib/admin-api";
import { toast } from "sonner";
import {
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  User,
  ArrowRight,
  Eye,
  X,
  Trash2,
} from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  ADMIN_SUSPEND_USER: "bg-amber-100 text-amber-700",
  ADMIN_BAN_USER: "bg-red-100 text-red-700",
  ADMIN_RESTORE_USER: "bg-emerald-100 text-emerald-700",
  ADMIN_CHANGE_ROLE: "bg-purple-100 text-purple-700",
  ADMIN_RESET_SESSION: "bg-blue-100 text-blue-700",
  ADMIN_UPDATE_USER: "bg-indigo-100 text-indigo-700",
  ADMIN_DELETE_USER: "bg-rose-100 text-rose-700",
};

export default function AdminAuditPage() {
  const { firebaseToken } = useAuthStore();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [detailLog, setDetailLog] = useState<AuditLogEntry | null>(null);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-audit-logs", page],
    queryFn: () => adminAuditApi.getLogs(firebaseToken!, { page, limit: 30 }),
    enabled: !!firebaseToken,
  });

  // Extract the paginated result
  const paginated = response?.data;
  const logs = paginated?.items || [];
  const totalPages = paginated?.totalPages || 1;

  const undoMut = useMutation({
    mutationFn: (logId: string) => adminAuditApi.undoAction(firebaseToken!, logId),
    onSuccess: () => {
      toast.success("Action undone successfully!");
      qc.invalidateQueries({ queryKey: ["admin-audit-logs"] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => toast.error(err.message || "Undo failed"),
  });

  const isUndoable = (action: string) =>
    ["ADMIN_UPDATE_USER", "ADMIN_SUSPEND_USER", "ADMIN_BAN_USER", "ADMIN_CHANGE_ROLE", "ADMIN_RESTORE_USER"].includes(action);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Audit Log</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {paginated?.total ?? "—"} total entries · Page {page}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-[#072460] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading audit logs…</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No audit entries yet</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left font-bold text-slate-600">Time</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">User</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Action</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Endpoint</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Target</th>
                <th className="px-5 py-3 text-right font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log: AuditLogEntry) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      {new Date(log.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#072460]/10 text-[#072460] font-bold text-[9px] flex items-center justify-center">
                        {log.user?.name?.charAt(0) || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {log.user?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-slate-400">{log.user?.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-md font-bold text-[10px] ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-slate-500 text-[10px] truncate max-w-[160px] block">
                      {log.endpoint}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {log.targetEntity ? (
                      <span className="text-slate-600">
                        {log.targetEntity}{" "}
                        <span className="font-mono text-slate-400 text-[10px]">
                          {log.targetId?.slice(0, 8)}…
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDetailLog(log)}
                        title="View Details"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {isUndoable(log.action) && log.previousValue && (
                        <button
                          onClick={() => {
                            if (confirm(`Undo "${log.action}" on ${log.targetEntity} ${log.targetId?.slice(0, 8)}?`))
                              undoMut.mutate(log.id);
                          }}
                          disabled={undoMut.isPending}
                          title="Undo this action"
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 cursor-pointer disabled:opacity-40"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
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

      {/* ── Detail Drawer ──────────────────────────────────────────────────── */}
      {detailLog && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
          onClick={() => setDetailLog(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Audit Entry Detail</h3>
              <button
                onClick={() => setDetailLog(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Action", value: detailLog.action },
                  { label: "Endpoint", value: detailLog.endpoint },
                  { label: "Performed By", value: detailLog.user?.name || detailLog.userId },
                  { label: "Role", value: detailLog.user?.role },
                  { label: "IP Address", value: detailLog.ipAddress || "—" },
                  { label: "Target Entity", value: detailLog.targetEntity || "—" },
                  { label: "Target ID", value: detailLog.targetId || "—" },
                  {
                    label: "Timestamp",
                    value: new Date(detailLog.createdAt).toLocaleString("en-IN"),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 break-all">{value}</p>
                  </div>
                ))}
              </div>

              {/* User Agent */}
              {detailLog.userAgent && (
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    User Agent
                  </p>
                  <p className="text-[10px] text-slate-500 bg-slate-50 p-3 rounded-xl font-mono break-all">
                    {detailLog.userAgent}
                  </p>
                </div>
              )}

              {/* Previous → New State */}
              {(detailLog.previousValue || detailLog.newValue) && (
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                    State Change
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-red-500 mb-1">Previous</p>
                      <pre className="text-[10px] bg-red-50 border border-red-100 rounded-xl p-3 overflow-auto max-h-40 font-mono text-red-700">
                        {JSON.stringify(detailLog.previousValue, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-500 mb-1">New</p>
                      <pre className="text-[10px] bg-emerald-50 border border-emerald-100 rounded-xl p-3 overflow-auto max-h-40 font-mono text-emerald-700">
                        {JSON.stringify(detailLog.newValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Details */}
              {detailLog.details && Object.keys(detailLog.details).length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Request Body
                  </p>
                  <pre className="text-[10px] bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto max-h-40 font-mono text-slate-700">
                    {JSON.stringify(detailLog.details, null, 2)}
                  </pre>
                </div>
              )}

              {/* Undo Button */}
              {isUndoable(detailLog.action) && detailLog.previousValue && (
                <button
                  onClick={() => {
                    undoMut.mutate(detailLog.id);
                    setDetailLog(null);
                  }}
                  disabled={undoMut.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs rounded-xl hover:bg-amber-100 disabled:opacity-50 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Undo This Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}