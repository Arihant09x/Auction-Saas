"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../store/auth.store";
import { Loader2 } from "lucide-react";

// Generic default paths that should be overridden by DB role
const GENERIC_DEFAULTS = new Set(["/", "/dashboard/organizer", ""]);

function AuthSyncContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const setFirebaseToken = useAuthStore((state) => state.setFirebaseToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);

    useEffect(() => {
        const token = searchParams.get("token");
        // The `next` param from the login page — may be stale or generic
        const nextParam = searchParams.get("next") || "";

        if (!token) {
            console.error("[AuthSync] No token provided. Redirecting to home.");
            router.replace("/");
            return;
        }

        setFirebaseToken(token);

        // Always fetch the real user from the backend — role MUST come from DB, never from Firebase
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(resData => {


                // Backend returns { success: true, data: { ...user } } or flat { ...user }
                const userData = resData.data || resData;

                if (userData && (userData.id || userData.email || userData.name)) {
                    setUser(userData);

                } else {
                    console.warn("[AuthSync] Received empty or invalid user data.");
                    setUser({ id: "synced", role: "USER", name: "User" } as any);
                }

                setLoading(false);

                // ─── Role-Based Navigation (Single Source of Truth) ───────────────
                // The DB role always wins over whatever the login page sent in `next`.
                // Only respect `nextParam` if it's a real deep-link (e.g. payment page),
                // not just the generic default home routes.
                const dbRole: string = userData?.role || "USER";
                const roleDefault = dbRole === "ADMIN" ? "/admin" : "/dashboard/organizer";
                const destination = (nextParam && !GENERIC_DEFAULTS.has(nextParam))
                    ? nextParam
                    : roleDefault;
                router.replace(destination);
            })
            .catch(err => {
                console.error("[AuthSync] Sync error:", err);
                setUser({ id: "synced", role: "USER", name: "User" } as any);
                setLoading(false);
                router.replace("/dashboard/organizer");
            });
        // Run once on mount only — token & next are URL params, they won't change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#072460] flex-col gap-4 text-white">
            <Loader2 className="h-10 w-10 animate-spin text-[#ffba00]" />
            <h2 className="text-xl font-semibold tracking-wide animate-pulse">Syncing Authentication...</h2>
            <p className="text-slate-300 text-sm">Please wait while we redirect you.</p>
        </div>
    );
}

export default function AuthSyncPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full bg-[#072460]" />}>
            <AuthSyncContent />
        </Suspense>
    );
}
