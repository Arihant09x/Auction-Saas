"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  shouldShowConsentBanner,
  getAnalyticsConsent,
  setAnalyticsConsent,
  dismissBannerForSession,
  CONSENT_CHANGE_EVENT,
} from "@/lib/consent";
import { optInPostHog, optOutPostHog } from "@/lib/posthog";
import { Cookie, ShieldCheck, BarChart3, X } from "lucide-react";

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const current = getAnalyticsConsent();
    setAnalyticsEnabled(current === "granted");
    setVisible(shouldShowConsentBanner());

    const handleConsentChange = () => {
      const updated = getAnalyticsConsent();
      setAnalyticsEnabled(updated === "granted");
    };

    const handleOpenPrefs = () => {
      const updated = getAnalyticsConsent();
      setAnalyticsEnabled(updated === "granted");
      setShowPreferences(true);
      setVisible(true);
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    window.addEventListener("auction11_open_cookie_preferences", handleOpenPrefs);

    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
      window.removeEventListener("auction11_open_cookie_preferences", handleOpenPrefs);
    };
  }, []);

  if (pathname?.startsWith("/overlay")) {
    return null;
  }

  if (!visible) {
    return null;
  }

  const handleAcceptAll = () => {
    optInPostHog();
    setAnalyticsEnabled(true);
    setVisible(false);
    setShowPreferences(false);
  };

  const handleRejectOptional = () => {
    optOutPostHog();
    setAnalyticsEnabled(false);
    setVisible(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    if (analyticsEnabled) {
      optInPostHog();
    } else {
      optOutPostHog();
    }
    setVisible(false);
    setShowPreferences(false);
  };

  const handleDismiss = () => {
    dismissBannerForSession();
    setVisible(false);
    setShowPreferences(false);
  };

  return (
    <aside
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none flex justify-center font-sans"
    >
      <div
        className="pointer-events-auto w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-[#0A307F] bg-[#072460]/95 backdrop-blur-xl p-5 sm:p-6 text-white transition-all duration-300"
        style={{ boxShadow: "0px 4px 60px rgba(0, 0, 0, 0.5)" }}
      >
        {!showPreferences ? (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2">

                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-['Poppins']">
                    Cookie &amp; Privacy Preferences
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#8AABDF] leading-relaxed">
                  Auction11 uses essential cookies and browser storage strictly required for security,
                  Firebase authentication, and Razorpay payment transactions. We also use optional
                  analytics to monitor live auction performance. We never track passwords,
                  payment credentials, or sensitive data.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-3.5 py-2 text-xs font-medium text-[#8AABDF] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors cursor-pointer"
              >
                Preferences
              </button>
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2 text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/50 rounded-full transition-colors cursor-pointer"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 text-xs font-bold text-[#012972] border border-[#0C3278] rounded-full hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                style={{
                  background: "#FFBA00",
                  boxShadow: "0 4px 16px rgba(255, 186, 0, 0.25)",
                }}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div role="dialog" aria-modal="true" aria-labelledby="preferences-title">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2
                id="preferences-title"
                className="text-base sm:text-lg font-bold text-white font-['Poppins']"
              >
                Customize Privacy Settings
              </h2>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#8AABDF] hover:text-white transition-colors cursor-pointer"
                aria-label="Close preferences"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1 text-xs sm:text-sm">
              {/* Strictly Necessary */}
              <div className="p-4 rounded-xl bg-[#012972]/60 border border-[#0A307F]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFBA00] shrink-0" />
                    <span className="font-bold text-white text-sm">Strictly Necessary Cookies</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFBA00]/15 text-[#FFBA00] font-bold uppercase tracking-wider whitespace-nowrap border border-[#FFBA00]/30">
                    Always Active
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#8AABDF] leading-relaxed pl-6">
                  Required for application functionality, Firebase user login sessions, API protection,
                  and Razorpay checkout security. These cannot be disabled.
                </p>
              </div>

              {/* Optional Analytics */}
              <div className="p-4 rounded-xl bg-[#012972]/60 border border-[#0A307F]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#FFBA00] shrink-0" />
                    <span className="font-bold text-white text-sm">Optional Analytics Cookies</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      className="sr-only peer"
                      aria-label="Toggle optional analytics cookies"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFBA00] border border-white/10"></div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-[#8AABDF] leading-relaxed pl-6">
                  Allows anonymous performance metrics via PostHog to optimize tournament load and
                  real-time bidding experience. No personal secrets or passwords are sent.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-4 py-2 text-xs font-medium text-[#8AABDF] hover:text-white transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 text-xs font-bold text-[#012972] border border-[#0C3278] rounded-full hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                style={{
                  background: "#FFBA00",
                  boxShadow: "0 4px 16px rgba(255, 186, 0, 0.25)",
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plain HTML style tag – safe for Turbopack */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 6px; height: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </aside>
  );
}

export default CookieConsentBanner;