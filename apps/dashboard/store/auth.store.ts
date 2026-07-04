import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User } from "@repo/types";

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

                setUser: (user) =>
                    set(
                        { user, isAuthenticated: !!user, isLoading: false, isHydrated: true },
                        false,
                        "auth/setUser",
                    ),

                setFirebaseToken: (token) =>
                    set({ firebaseToken: token }, false, "auth/setFirebaseToken"),

                setLoading: (isLoading) =>
                    set({ isLoading }, false, "auth/setLoading"),

                setInitialized: (isInitialized) =>
                    set({ isInitialized }, false, "auth/setInitialized"),

                logout: () =>
                    set(
                        {
                            user: null,
                            firebaseToken: null,
                            isAuthenticated: false,
                            isLoading: false,
                        },
                        false,
                        "auth/logout",
                    ),

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
                    }
                },
            },
        ),
        { name: "AuthStore" },
    ),
);
