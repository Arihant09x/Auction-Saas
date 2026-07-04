"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../store/auth.store";
import { Loader2 } from "lucide-react";

function AuthSyncContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const setFirebaseToken = useAuthStore((state) => state.setFirebaseToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);

    useEffect(() => {
        const token = searchParams.get("token");
        const nextUrl = searchParams.get("next") || "/dashboard/organizer";

        if (token) {
            setFirebaseToken(token);
            
            // Fetch real user object from Backend
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            fetch(`${backendUrl}/auth/login`, {
                 method: "POST",
                 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(resData => {
                 console.log("[AuthSync] Received data:", resData);
                 // The backend returns { success: true, data: { ...userinfo }, message: "..." }
                 const userData = resData.data || resData;
                 
                 if (userData && (userData.id || userData.email || userData.name)) {
                    setUser(userData);
                     console.log("[AuthSync] User set successfully:", userData);
                 } else {
                     console.warn("[AuthSync] Received empty or invalid user data");
                     setUser({ id: "synced", role: "USER", name: "User" } as any);
                 }
                 setLoading(false);
                 router.replace(nextUrl);
            })
            .catch(err => {
                 console.error("Sync error:", err);
                 // Fallback
                 setUser({ id: "synced", role: "USER", name: "User" } as any);
                 setLoading(false);
                 router.replace(nextUrl);
            });
        } else {
            console.error("No token provided to AuthSync");
            router.replace("/");
        }
    }, [searchParams, router, setFirebaseToken, setUser, setLoading]);

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
