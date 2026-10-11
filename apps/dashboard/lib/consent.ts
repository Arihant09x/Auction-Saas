/**
 * Auction11 Cookie & Privacy Consent Manager
 * 
 * Manages user consent for optional analytics (PostHog, etc.) while distinguishing
 * strictly necessary essential cookies (Firebase Auth, session tokens, Razorpay security).
 */

export type ConsentStatus = "granted" | "denied" | "undecided";

export const CONSENT_STORAGE_KEY = "auction11_analytics_consent";
export const SESSION_DISMISSED_KEY = "auction11_consent_dismissed_session";
export const CONSENT_CHANGE_EVENT = "auction11_consent_change";

export function getAnalyticsConsent(): ConsentStatus {
  if (typeof window === "undefined") return "undecided";
  try {
    const val = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (val === "granted" || val === "denied") return val;
  } catch {
    // Ignore storage errors (e.g. private browsing restrictions)
  }
  return "undecided";
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === "granted";
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  const status: ConsentStatus = granted ? "granted" : "denied";
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { consent: status } }));
}

export function dismissBannerForSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { dismissed: true } }));
}

export function shouldShowConsentBanner(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // If dismissed in this browser session, do not show again on subsequent route navigations
    const dismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY);
    if (dismissed === "true") return false;
  } catch {
    return false;
  }
  return true;
}
