"use client";

import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect, type ReactNode } from "react";
import { initPostHog, posthog } from "@/lib/posthog";
import { PostHogProvider } from "posthog-js/react";
import type { PostHog } from "posthog-js";
export function Providers({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<PostHog | null>(null);
    useEffect(() => {
        const c = initPostHog();
        setClient(c);
    }, []);

    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 30 * 1000,
                    gcTime: 5 * 60 * 1000,
                    retry: 1,
                    refetchOnWindowFocus: true,
                },
                mutations: {
                    retry: 0,
                },
            },
        })
    );
    if (!client) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }
    return (
        <PostHogProvider client={client}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster position="top-right" richColors />
                {process.env.NODE_ENV === "development" && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </QueryClientProvider>
        </PostHogProvider>
    );
}
