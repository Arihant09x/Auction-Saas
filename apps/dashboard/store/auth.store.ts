import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User } from "@repo/types";

// ─── Cookie Sharing Helpers ──────────────────────────────────────────────────

function setSharedCookie(name: string, value: string, days = 7) {
    if (typeof window === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const hostname = window.location.hostname;
    let domain = "";
    if (hostname.includes("auction11.live")) {
        domain = "; domain=.auction11.live";
    }
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domain}; SameSite=Lax`;
}

function eraseSharedCookie(name: string) {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    let domain = "";
    if (hostname.includes("auction11.live")) {
        domain = "; domain=.auction11.live";
    }
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;${domain}`;
}

const syncToCookie = (user: any, token: string | null) => {
    if (!token || !user) {
        eraseSharedCookie("auction11_auth");
    } else {
        setSharedCookie("auction11_auth", JSON.stringify({ token, user }));
    }
};

// ─── State Shape ────────────────────────────────────────────────────────────

interface AuthState {
    user: User | null;
    firebaseToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isHydrated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setFirebaseToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    logout: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                firebaseToken: null,
                isLoading: true,
                isAuthenticated: false,
                isInitialized: false,
                isHydrated: false,

                setUser: (user) => {
                    set(
                        { user, isAuthenticated: !!user, isLoading: false, isHydrated: true },
                        false,
                        "auth/setUser",
                    );
                    const state = useAuthStore.getState();
                    syncToCookie(user, state.firebaseToken);
                },

                setFirebaseToken: (token) => {
                    set({ firebaseToken: token }, false, "auth/setFirebaseToken");
                    const state = useAuthStore.getState();
                    syncToCookie(state.user, token);
                },

                setLoading: (isLoading) =>
                    set({ isLoading }, false, "auth/setLoading"),

                setInitialized: (isInitialized) =>
                    set({ isInitialized }, false, "auth/setInitialized"),

                logout: () => {
                    set(
                        {
                            user: null,
                            firebaseToken: null,
                            isAuthenticated: false,
                            isLoading: false,
                        },
                        false,
                        "auth/logout",
                    );
                    syncToCookie(null, null);
                },

            }),
            {
                name: "bid-arena-auth",
                // Persist both user and token so API requests work after reload
                partialize: (state) => ({ user: state.user, firebaseToken: state.firebaseToken }),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        (state as any).isHydrated = true;
                        // Use the internal set function to trigger a re-render if needed
                        useAuthStore.setState({ isHydrated: true });
                        syncToCookie(state.user, state.firebaseToken);
                    }
                },
            },
        ),
        { name: "AuthStore" },
    ),
);
