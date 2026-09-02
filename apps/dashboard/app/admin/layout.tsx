"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/auth.store";
import {
  BarChart3,
  FileText,
  Users,
  Layers,
  Zap,
  DollarSign,
  ShieldCheck,
  Settings,
  Radio,
  Building2,
  ShieldAlert,
  Loader2,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";


const MAIN_WEBSITE_URL =
  process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001";

/** Roles allowed in the admin panel */
const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "CONTENT_EDITOR", "ANALYST"]);

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles?: string[]; // if undefined → available to all admin roles
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/cms", label: "CMS & Articles", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"] },
  { href: "/admin/auctions", label: "Auctions", icon: Layers, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/live", label: "Live Control", icon: Radio, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/organizers", label: "Organizers", icon: Building2, roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"] },
  { href: "/admin/payments", label: "Payments", icon: DollarSign, roles: ["SUPER_ADMIN", "ADMIN", "ANALYST"] },
  { href: "/admin/audit", label: "Audit Log", icon: ShieldCheck, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["ADMIN", "SUPER_ADMIN"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseToken, user, isHydrated, logout } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userRole = (user as any)?.role as string | undefined;

  useEffect(() => {
    if (!isHydrated) return;

    if (!firebaseToken) {
      window.location.href = `${MAIN_WEBSITE_URL}/login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }

    // Fast-path: Zustand already has role
    if (userRole) {
      setIsAuthorized(ADMIN_ROLES.has(userRole));
      return;
    }

    // Fallback: verify via backend
    const verify = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
        });
        if (!res.ok) throw new Error("Backend verification failed");
        const resData = await res.json();
        const dbRole: string = resData?.data?.role || resData?.role || "";
        setIsAuthorized(ADMIN_ROLES.has(dbRole));
      } catch {
        setIsAuthorized(false);
      }
    };

    verify();
  }, [isHydrated, firebaseToken, userRole]);

  const handleLogout = async () => {
    try {
      if (auth && typeof auth.signOut === "function") await signOut(auth);
    } catch { /* ignore */ }
    logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("bid-arena-auth");
      window.location.href = `${MAIN_WEBSITE_URL}/login`;
    }
  };

  // ─── Loading State ────────────────────────────────────────────────────────
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#072460]">
        <Loader2 className="h-10 w-10 animate-spin text-[#ffba00]" />
        <p className="mt-4 text-sm font-bold text-white/70">Verifying Admin Access…</p>
      </div>
    );
  }

  // ─── Unauthorized ─────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 p-6 text-center text-white">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            You do not have the required permissions to view the Auction11 Admin Panel.
          </p>
          <a
            href={`${MAIN_WEBSITE_URL}/login`}
            className="inline-flex items-center justify-center w-full py-3 bg-[#ffba00] text-[#072460] font-extrabold text-sm uppercase rounded-xl hover:bg-[#ffe066] transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // ─── Admin Shell ──────────────────────────────────────────────────────────
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole)),
  );

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#072460] text-white flex flex-col justify-between py-6 shrink-0 shadow-xl z-20">
        <div>
          {/* Logo */}
          <div className="flex-shrink-0">

            <img
              src="/final-1.png"
              alt="Auction 11 Logo"
              width={200}
              height={200}
              className="object-contain flex items-center justify-center text-center ml-5 mb-5 hover:cursor-text"

            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 px-3">
            {visibleNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 w-full rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${active ? "text-[#ffba00]" : "text-slate-400 group-hover:text-[#ffba00]"}`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-[#ffba00] text-[#072460] rounded text-[9px] font-black">
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3 h-3 text-white/50" />}
                </Link>
              );
            })}
          </nav>

          {/* Role Badge */}
          <div className="mx-4 mt-4 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Signed in as</p>
            <p className="text-xs font-bold text-[#ffba00] mt-0.5">{userRole ?? "ADMIN"}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-3 bg-white/10 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-[#ffba00] text-[#072460] font-bold text-xs flex items-center justify-center shrink-0">
              {(user as any)?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{(user as any)?.name || "Administrator"}</p>
              <p className="text-[10px] text-slate-300 truncate">{(user as any)?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Admin</span>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize font-medium text-[#072460]">
                  {pathname.split("/admin/")[1]?.split("/")[0] || ""}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <Bell className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              {userRole}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto  bg-slate-50">
          {children}
        </main>
      </div>

      {/* ── Logout Modal ──────────────────────────────────────────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out?</h3>
            <p className="text-sm text-slate-500 mb-6">You will be logged out of the admin panel.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
