"use client";

import { useAuthStore } from "../../../store/auth.store";
import {
  Settings,
  Shield,
  Globe,
  Bell,
  Database,
  Lock,
  Zap,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const userRole = (user as any)?.role as string;

  if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <Lock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700 mb-1">Super Admin Only</h2>
          <p className="text-sm text-slate-500">
            Settings are restricted to SUPER_ADMIN accounts.
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Platform Configuration",
      icon: Globe,
      items: [
        { label: "Site Name", value: "Auction11", type: "text" },
        { label: "Support Email", value: "support@auction11.live", type: "text" },
        { label: "Default Plan Tier", value: "FREE", type: "select" },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { label: "Max Login Attempts", value: "5", type: "text" },
        { label: "Session Timeout (hours)", value: "24", type: "text" },
        { label: "Enforce 2FA for Admins", value: "Disabled", type: "toggle" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Email on New Signup", value: "Enabled", type: "toggle" },
        { label: "Email on Payment", value: "Enabled", type: "toggle" },
        { label: "Slack Webhook URL", value: "", type: "text" },
      ],
    },
    {
      title: "Database & Performance",
      icon: Database,
      items: [
        { label: "Auto-purge Audit Logs (days)", value: "90", type: "text" },
        { label: "Cache TTL (seconds)", value: "300", type: "text" },
        { label: "Max Upload Size (MB)", value: "10", type: "text" },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Platform-wide configuration. Changes require SUPER_ADMIN access.
        </p>
      </div>

      {sections.map((section) => (
        <div
          key={section.title}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <section.icon className="w-4 h-4 text-[#072460]" />
            {section.title}
          </h3>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
              >
                <label className="text-xs font-semibold text-slate-600">
                  {item.label}
                </label>
                {item.type === "toggle" ? (
                  <button
                    type="button"
                    className={`relative h-5 w-9 rounded-full transition-colors ${item.value === "Enabled" ? "bg-[#072460]" : "bg-slate-200"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${item.value === "Enabled"
                        ? "translate-x-4"
                        : "translate-x-0.5"
                        }`}
                    />
                  </button>
                ) : item.type === "select" ? (
                  <select
                    defaultValue={item.value}
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] cursor-pointer"
                  >
                    {["FREE", "BASIC", "STANDARD", "PREMIUM", "ELITE", "ULTIMATE", "MEGA"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    defaultValue={item.value}
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#072460] w-48 text-right"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save button placeholder */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-[#072460] text-white text-xs font-bold rounded-xl hover:bg-[#0a307f] transition-all cursor-pointer flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          Save Settings
        </button>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-[10px] text-amber-700 font-semibold text-center">
          ⚠️ Settings are currently UI-only. Backend persistence for platform config is planned for a future release.
        </p>
      </div>
    </div>
  );
}
