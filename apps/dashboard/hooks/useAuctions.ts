"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";

const handleAuthError = (res?: Response) => {
    // If we have a Response, check its status explicitly.
    // If res is undefined, it means we forcefully intercepted an expired token before fetching!
    if (!res || res.status === 401 || res.status === 403) {
        useAuthStore.getState().logout();
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/login`;
    }
};

const isTokenExpired = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3 || !parts[1]) return true;
        const payload = JSON.parse(atob(parts[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};

export function useAuctions() {
    const { firebaseToken, isInitialized } = useAuthStore();

    return useQuery({
        queryKey: ["auctions"],
        queryFn: async () => {
            if (!firebaseToken) return [];

            if (isTokenExpired(firebaseToken)) {
                console.warn("[useAuctions] Intercepted expired token natively. Booting user...");
                handleAuthError();
                throw new Error("Token expired locally.");
            }

            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


            const res = await fetch(`${backendUrl}/auction`, {
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });

            if (!res.ok) {
                handleAuthError(res);
                throw new Error("Failed to fetch auctions");
            }

            const resData = await res.json();
            // Handle { success: true, data: [...], message: "..." }
            return Array.isArray(resData.data) ? resData.data : (Array.isArray(resData) ? resData : []);
        },
        enabled: isInitialized && !!firebaseToken,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}

export function useJoinedAuctions() {
    const { firebaseToken, isInitialized } = useAuthStore();

    return useQuery({
        queryKey: ["joined-auctions"],
        queryFn: async () => {
            if (!firebaseToken) return [];

            if (isTokenExpired(firebaseToken)) {
                console.warn("[useJoinedAuctions] Intercepted expired token natively. Booting user...");
                handleAuthError();
                throw new Error("Token expired locally.");
            }

            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            ("[useJoinedAuctions] Fetching joined auction data...");

            const res = await fetch(`${backendUrl}/auction/joined`, {
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });

            if (!res.ok) {
                handleAuthError(res);
                throw new Error("Failed to fetch joined auctions");
            }

            const resData = await res.json();
            return Array.isArray(resData.data) ? resData.data : (Array.isArray(resData) ? resData : []);
        },
        enabled: isInitialized && !!firebaseToken,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
