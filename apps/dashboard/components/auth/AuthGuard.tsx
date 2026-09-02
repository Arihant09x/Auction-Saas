"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuthStore } from "../../store/auth.store";
import { Loader2 } from "lucide-react";

const MAIN_WEBSITE_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001";
const LOGIN_URL = `${MAIN_WEBSITE_URL}/login`;

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { setUser, setFirebaseToken, setInitialized, isInitialized, firebaseToken, user, isHydrated, logout } = useAuthStore();
    const [isInternalLoading, setIsInternalLoading] = useState(true);
    const [isFirebaseChecked, setIsFirebaseChecked] = useState(false);

    useEffect(() => {
        // Read and parse shared cookie to sync authentication session if not already in store
        const getSharedCookie = (name: string): string | null => {
            if (typeof document === "undefined") return null;
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                if (!c) continue;
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        };

        const checkCookie = () => {
            const cookieVal = getSharedCookie("auction11_auth");
            if (!cookieVal) {
                const currentToken = useAuthStore.getState().firebaseToken;
                if (currentToken) {
                    ("[AuthGuard] Cookie session removed. Logging out...");
                    useAuthStore.getState().logout();
                    window.location.reload();
                }
            }
        };

        const cookieVal = getSharedCookie("auction11_auth");
        if (cookieVal) {
            try {
                const session = JSON.parse(cookieVal);
                if (session && session.token && session.user) {
                    const currentToken = useAuthStore.getState().firebaseToken;
                    if (!currentToken || currentToken !== session.token) {
                        ("[AuthGuard] Restoring session from shared cookie.");
                        setFirebaseToken(session.token);
                        setUser(session.user);
                    }
                }
            } catch (e) {
                console.error("[AuthGuard] Error parsing shared cookie session:", e);
            }
        }

        // Storage listener for logout from other tabs of the same dashboard domain
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "bid-arena-auth" && !e.newValue) {
                ("[AuthGuard] Logout from another tab detected.");
                window.location.reload();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        const interval = setInterval(checkCookie, 5000);
        window.addEventListener("focus", checkCookie);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
            window.removeEventListener("focus", checkCookie);
        };
    }, [setUser, setFirebaseToken]);

    useEffect(() => {
        if (!isHydrated) return;

        // 1. Listen for Auth State changes
        const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
            console.error("[AuthGuard] Firebase Auth status received. User:", !!fbUser);
            setIsFirebaseChecked(true);

            if (fbUser) {
                const existingUser = useAuthStore.getState().user;
                // ⚠️  IMPORTANT: Never set role here. Role comes exclusively from the
                // backend DB (set during /auth/sync). Only merge Firebase identity fields.
                setUser({
                    ...existingUser,
                    id: existingUser?.id && existingUser.id !== fbUser.uid ? existingUser.id : fbUser.uid,
                    firebaseUid: fbUser.uid,
                    email: fbUser.email || existingUser?.email || "",
                    name: fbUser.displayName || existingUser?.name || "User",
                    profileUrl: fbUser.photoURL || existingUser?.profileUrl || null,
                    // role is intentionally NOT set here — preserve whatever the DB returned
                } as any);
                setInitialized(true);
                setIsInternalLoading(false);
            } else {
                console.warn("[AuthGuard] No active Firebase session on this origin.");
                // Note: We don't call logout() here because we support cross-origin synced tokens
            }
        });

        // 2. Refresh Token Listener
        const unsubscribeToken = onIdTokenChanged(auth, async (fbUser) => {
            if (fbUser) {
                const token = await fbUser.getIdToken();
                setFirebaseToken(token);
            }
        });

        // 3. Redirection & Loading Logic
        const checkAuth = setTimeout(() => {
            const currentToken = useAuthStore.getState().firebaseToken;
            const currentUser = useAuthStore.getState().user;

            console.error("[AuthGuard] Security Check Status:", {
                firebaseChecked: isFirebaseChecked,
                validStoreToken: !!currentToken,
                fbUserSession: !!auth.currentUser
            });

            // If Firebase checked and found nothing, but we DO have a synced token/user...
            // We allow it! This is the cross-origin bridge.
            if (isFirebaseChecked && !auth.currentUser && currentToken && currentUser) {
                ("[AuthGuard] Using synced session token.");
                setInitialized(true);
                setIsInternalLoading(false);
                return;
            }

            // ONLY redirect if we have absolutely no session even after Firebase checked
            if (isFirebaseChecked && !auth.currentUser && !currentToken) {
                console.error("[AuthGuard] No session found anywhere. Redirecting to login...");
                const redirectParam = typeof window !== "undefined" ? `?redirect=${encodeURIComponent(window.location.href)}` : "";
                window.location.href = `${LOGIN_URL}${redirectParam}`;
                return;
            }

            // No data at all and not checking anymore
            if (!isFirebaseChecked && !currentToken && !currentUser) {
                console.error("[AuthGuard] No local or remote session. Redirecting...");
                const redirectParam = typeof window !== "undefined" ? `?redirect=${encodeURIComponent(window.location.href)}` : "";
                window.location.href = `${LOGIN_URL}${redirectParam}`;
                return;
            }

            // Success Case (Firebase Logged In)
            if (isFirebaseChecked && auth.currentUser) {
                setIsInternalLoading(false);
                setInitialized(true);
            }

        }, 1500);

        return () => {
            unsubscribeAuth();
            unsubscribeToken();
            clearTimeout(checkAuth);
        };
    }, [isHydrated, isFirebaseChecked, setUser, setFirebaseToken, setInitialized, logout]);

    // Show a premium loader while we verify the session
    if (!isInitialized && isInternalLoading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-[#FFBA00]" />

            </div>
        );
    }

    return <>{children}</>;
}
