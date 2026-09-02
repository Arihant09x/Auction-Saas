"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";

export default function DashboardRoot() {
    const router = useRouter();
    const { isHydrated, user } = useAuthStore();

    useEffect(() => {
        // Wait for Zustand to hydrate from localStorage before reading role
        if (!isHydrated) return;

        const role = user?.role;

        if (role as string === "ADMIN") {
            router.replace("/admin");
        } else {
            // Default for USER and any unauthenticated state (AuthGuard will handle redirect to login)
            router.replace("/dashboard/organizer");
        }
    }, [isHydrated, user?.role, router]);

    // Render nothing while deciding — AuthGuard in the target layout handles auth
    return null;
}
