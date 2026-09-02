"use client";

import posthogLib from "posthog-js";
import type { PostHog } from "posthog-js";

// Export the client variable so it can be used directly
export let posthogClient: PostHog | null = null;

export const initPostHog = () => {
  if (typeof window === "undefined") return null;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key || process.env.NODE_ENV === "development") {
    ("[PostHog] Not initializing - missing key or development mode");
    return null;
  }

  try {
    posthogLib.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
    });

    posthogClient = posthogLib;
    ("[PostHog] Initialized");
    return posthogLib;
  } catch (error) {
    console.error("[PostHog] Initialization error:", error);
    return null;
  }
};

// Your wrapper API (unchanged)
export const posthog = {
  identify: (userId: string, traits?: Record<string, any>) => {
    if (!posthogClient) {
      console.warn("[PostHog] posthog not initialized, skipping identify");
      return;
    }
    posthogClient.identify(userId, traits);
  },

  reset: () => {
    if (!posthogClient) return;
    posthogClient.reset();
  },

  capture: (eventName: string, properties?: Record<string, any>) => {
    if (!posthogClient) {
      console.warn("[PostHog] posthog not initialized, skipping capture");
      return;
    }
    posthogClient.capture(eventName, properties);
  },

  page: () => {
    if (!posthogClient) return;
    posthogClient.capture("$pageview");
  },

  isReady: () => !!posthogClient,
};

// Auto-initialize on client side
if (typeof window !== "undefined") {
  initPostHog();
}

export default posthog;