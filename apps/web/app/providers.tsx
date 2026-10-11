"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { initPostHog } from "@/lib/posthog";
import { PostHogProvider } from "posthog-js/react";
import type { PostHog } from "posthog-js";
import { CONSENT_CHANGE_EVENT, hasAnalyticsConsent } from "@/lib/consent";
import { PostHogPageView } from "@/components/PostHogPageView";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export function Providers({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    // Only initialize if analytics consent has been granted
    if (hasAnalyticsConsent()) {
      const ph = initPostHog();
      setClient(ph);
    }

    const handleConsentChange = () => {
      if (hasAnalyticsConsent()) {
        const ph = initPostHog();
        setClient(ph);
      } else {
        setClient(null);
      }
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    };
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

  const content = (
    <QueryClientProvider client={queryClient}>
      <PostHogPageView />
      {children}
      <CookieConsentBanner />
    </QueryClientProvider>
  );

  if (client) {
    return <PostHogProvider client={client}>{content}</PostHogProvider>;
  }

  return content;
}