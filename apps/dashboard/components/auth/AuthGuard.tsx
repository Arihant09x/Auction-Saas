"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuthStore } from "../../store/auth.store";
import { Loader2 } from "lucide-react";

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3001/login";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { setUser, setFirebaseToken, setInitialized, isInitialized, firebaseToken, user, isHydrated, logout } = useAuthStore();
    const [isInternalLoading, setIsInternalLoading] = useState(true);
    const [isFirebaseChecked, setIsFirebaseChecked] = useState(false);

    useEffect(() => {
        if (!isHydrated) return;

        // 1. Listen for Auth State changes
        const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
            console.log("[AuthGuard] Firebase Auth status received. User:", !!fbUser);
            setIsFirebaseChecked(true);

            if (fbUser) {
                const existingUser = useAuthStore.getState().user;
                setUser({
                    ...existingUser,
                    id: existingUser?.id && existingUser.id !== fbUser.uid ? existingUser.id : fbUser.uid,
                    firebaseUid: fbUser.uid,
                    email: fbUser.email || existingUser?.email || "",
                    name: fbUser.displayName || existingUser?.name || "User",
                    profileUrl: fbUser.photoURL || existingUser?.profileUrl || null,
                    role: existingUser?.role || "USER",
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

            console.log("[AuthGuard] Security Check Status:", {
                firebaseChecked: isFirebaseChecked,
                validStoreToken: !!currentToken,
                fbUserSession: !!auth.currentUser
            });

            // If Firebase checked and found nothing, but we DO have a synced token/user...
            // We allow it! This is the cross-origin bridge.
            if (isFirebaseChecked && !auth.currentUser && currentToken && currentUser) {
                console.log("[AuthGuard] Using synced session token.");
                setInitialized(true);
                setIsInternalLoading(false);
                return;
            }

            // ONLY redirect if we have absolutely no session even after Firebase checked
            if (isFirebaseChecked && !auth.currentUser && !currentToken) {
                console.error("[AuthGuard] No session found anywhere. Redirecting to login...");
                window.location.href = LOGIN_URL;
                return;
            }

            // No data at all and not checking anymore
            if (!isFirebaseChecked && !currentToken && !currentUser) {
                console.error("[AuthGuard] No local or remote session. Redirecting...");
                window.location.href = LOGIN_URL;
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
