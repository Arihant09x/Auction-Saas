"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { initPostHog, posthogClient } from "@/lib/posthog";
import { PostHogProvider } from "posthog-js/react";
import type { PostHog } from "posthog-js";

export function Providers({ children }: { children: ReactNode }) {
    const [client, setClient] = useState<PostHog | null>(null);

    useEffect(() => {
        // Initialize PostHog and store the client
        const c = initPostHog();
        setClient(c);
    }, []);

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            })
    );

    // While the client is loading, render children without PostHog
    if (!client) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    return (
        <PostHogProvider client={client}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </PostHogProvider>
    );
}