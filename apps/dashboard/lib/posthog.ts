"use client";

import posthogLib from "posthog-js";
import type { PostHog } from "posthog-js";
import { hasAnalyticsConsent, setAnalyticsConsent } from "./consent";

export let posthogClient: PostHog | null = null;
let isInitializing = false;
let isInitialized = false;

const SENSITIVE_KEYS = new Set([
  "password",
  "pass",
  "token",
  "idtoken",
  "refreshtoken",
  "accesstoken",
  "authorization",
  "signature",
  "razorpaysignature",
  "razorpay_signature",
  "secret",
  "key_secret",
  "creditcard",
  "card",
  "cvv",
]);

function sanitizeProps(props?: Record<string, any>): Record<string, any> | undefined {
  if (!props) return undefined;
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(props)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (SENSITIVE_KEYS.has(normalizedKey)) {
      continue;
    }
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      cleaned[key] = sanitizeProps(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export const initPostHog = (): PostHog | null => {
  if (typeof window === "undefined") return null;

  // React Strict Mode and duplicate execution guard
  if (isInitialized && posthogClient) return posthogClient;
  if (isInitializing) return posthogClient;

  // Strictly enforce consent before initializing analytics
  if (!hasAnalyticsConsent()) {
    return null;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) {
    return null;
  }

  try {
    isInitializing = true;
    posthogLib.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false, // Handled explicitly by PostHogPageView to avoid double counting
      capture_pageleave: true,
      autocapture: false, // Avoid capturing arbitrary form input text
      loaded: (ph) => {
        posthogClient = ph as unknown as PostHog;
        isInitialized = true;
        isInitializing = false;
      },
    });

    posthogClient = posthogLib;
    isInitialized = true;
    isInitializing = false;
    return posthogLib;
  } catch (error) {
    isInitializing = false;
    console.error("[PostHog] Initialization error:", error);
    return null;
  }
};

export const optInPostHog = (): PostHog | null => {
  setAnalyticsConsent(true);
  const client = initPostHog();
  if (client) {
    try {
      client.opt_in_capturing();
    } catch {
      // silent
    }
  }
  return client;
};

export const optOutPostHog = (): void => {
  setAnalyticsConsent(false);
  if (posthogClient) {
    try {
      posthogClient.opt_out_capturing();
      posthogClient.reset();
    } catch {
      // silent
    }
  }
  posthogClient = null;
  isInitialized = false;
  isInitializing = false;
};

export const posthog = {
  identify: (userId: string, traits?: Record<string, any>) => {
    try {
      if (!hasAnalyticsConsent() || !posthogClient) return;
      const safeTraits = sanitizeProps(traits);
      posthogClient.identify(userId, safeTraits);
    } catch (e) {
      console.warn("[PostHog] identify error ignored:", e);
    }
  },

  reset: () => {
    try {
      if (!posthogClient) return;
      posthogClient.reset();
    } catch (e) {
      console.warn("[PostHog] reset error ignored:", e);
    }
  },

  capture: (eventName: string, properties?: Record<string, any>) => {
    try {
      if (!hasAnalyticsConsent() || !posthogClient) return;
      const safeProps = sanitizeProps(properties);
      posthogClient.capture(eventName, safeProps);
    } catch (e) {
      console.warn("[PostHog] capture error ignored:", e);
    }
  },

  page: () => {
    try {
      if (!hasAnalyticsConsent() || !posthogClient) return;
      posthogClient.capture("$pageview");
    } catch (e) {
      console.warn("[PostHog] pageview error ignored:", e);
    }
  },

  isReady: () => !!posthogClient && hasAnalyticsConsent(),
};

export default posthog;