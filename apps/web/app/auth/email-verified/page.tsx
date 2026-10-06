"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RefreshCw, LogIn, ArrowRight } from "lucide-react";
import { auth } from "@/lib/firebase";
import { applyActionCode, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { ParticlesBackground } from "@/components/ui/ParticlesBackground";
import { Button } from "@repo/ui/button";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function EmailVerifiedContent() {
  const [status, setStatus] = useState<"loading" | "success" | "not_verified" | "no_user" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const processedRef = useRef(false);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const syncVerificationWithBackend = async (user: any) => {
    await user.reload();
    const freshToken = await user.getIdToken(true);

    const res = await fetch(`${BACKEND_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${freshToken}`,
      },
    });

    if (!res.ok) {
      let msg = "Failed to sync verification with database.";
      try {
        const errData = await res.json();
        if (errData.message) msg = Array.isArray(errData.message) ? errData.message.join(", ") : errData.message;
      } catch {}
      throw new Error(msg);
    }

    return freshToken;
  };

  const handleVerificationFlow = async () => {
    if (processedRef.current) return;
    processedRef.current = true;

    setStatus("loading");

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    let actionApplied = false;

    if (mode === "verifyEmail" && oobCode) {
      try {
        await applyActionCode(auth, oobCode);
        actionApplied = true;
      } catch (err: any) {
        console.warn("Firebase applyActionCode result:", err?.code || err?.message);
      }
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          const freshToken = await syncVerificationWithBackend(currentUser);
          setStatus("success");
          setTimeout(() => {
            window.location.href = `${DASHBOARD_URL}/auth/sync?token=${freshToken}&next=/dashboard/organizer`;
          }, 2000);
          return;
        }
      } catch (err: any) {
        console.error("Error syncing user verification:", err);
      }
    }

    if (actionApplied) {
      setStatus("success");
      return;
    }

    if (mode === "verifyEmail" && oobCode) {
      setStatus("error");
      setErrorMessage("This email verification link has expired or has already been used. Please request a new verification link.");
      return;
    }

    if (currentUser) {
      if (currentUser.emailVerified) {
        try {
          const freshToken = await syncVerificationWithBackend(currentUser);
          setStatus("success");
          setTimeout(() => {
            window.location.href = `${DASHBOARD_URL}/auth/sync?token=${freshToken}&next=/dashboard/organizer`;
          }, 2000);
        } catch (err: any) {
          setStatus("error");
          setErrorMessage(err.message || "Failed to sync verification status.");
        }
      } else {
        setStatus("not_verified");
      }
    } else {
      setStatus("no_user");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      handleVerificationFlow();
    });

    return () => unsubscribe();
  }, []);

  const handleManualCheck = async () => {
    if (auth.currentUser) {
      setStatus("loading");
      try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          const freshToken = await syncVerificationWithBackend(auth.currentUser);
          setStatus("success");
          setTimeout(() => {
            window.location.href = `${DASHBOARD_URL}/auth/sync?token=${freshToken}&next=/dashboard/organizer`;
          }, 2000);
        } else {
          setStatus("not_verified");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Failed to verify email status.");
      }
    } else {
      setStatus("no_user");
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      if (auth.currentUser) {
        const actionCodeSettings = {
          url: process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_URL || "https://auction11.live/auth/email-verified",
          handleCodeInApp: false,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        setResendCooldown(60);
      } else {
        setStatus("no_user");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#072460] flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0d44b5]/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] relative z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image src="/final-1.png" alt="Auction 11 Logo" width={200} height={55} className="object-contain" />
          </Link>
        </div>

        <div className="bg-[#0a2060]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
          {/* LOADING STATE */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-12 h-12 border-4 border-[#ffba00]/30 border-t-[#ffba00] rounded-full animate-spin" />
              <h2 className="text-xl font-bold text-white">Verifying Your Email...</h2>
              <p className="text-sm text-white/70">Please wait while we confirm your account status.</p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-bold text-white">Email Verified Successfully</h2>
              <p className="text-sm text-emerald-400 font-medium">Your Auction11 account is ready.</p>
              <p className="text-xs text-white/60">Redirecting to your dashboard in a moment...</p>

              <Button
                onClick={() => {
                  if (auth.currentUser) {
                    auth.currentUser.getIdToken().then((token: string) => {
                      window.location.href = `${DASHBOARD_URL}/auth/sync?token=${token}&next=/dashboard/organizer`;
                    });
                  } else {
                    window.location.href = `${DASHBOARD_URL}/login`;
                  }
                }}
                className="w-full mt-4 font-epilogue bg-[#ffba00] text-[#012972] font-bold py-3 rounded-xl hover:bg-[#e0a400] transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard Now <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {/* NOT VERIFIED YET */}
          {status === "not_verified" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-[#ffba00]/10 border border-[#ffba00]/30 flex items-center justify-center text-[#ffba00]">
                <RefreshCw size={32} />
              </div>
              <h2 className="text-xl font-bold text-white">Email Not Verified Yet</h2>
              <p className="text-xs text-white/70 leading-relaxed max-w-[320px]">
                Please check your email inbox and click the verification link sent by Auction11.
              </p>

              <div className="flex flex-col w-full gap-3 mt-4">
                <Button
                  onClick={handleManualCheck}
                  className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold py-3 rounded-xl hover:bg-[#e0a400] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Check Verification Status
                </Button>

                <button
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0 || isResending}
                  className="text-xs text-[#ffba00] hover:underline font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5 py-1"
                >
                  <RefreshCw size={12} className={isResending ? "animate-spin" : ""} />
                  {resendCooldown > 0 ? `Resend link in ${resendCooldown}s` : "Resend Verification Email"}
                </button>
              </div>
            </div>
          )}

          {/* NO ACTIVE SESSION */}
          {status === "no_user" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                <LogIn size={32} />
              </div>
              <h2 className="text-xl font-bold text-white">Sign In Required</h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Please sign in to complete your email verification.
              </p>

              <Link href="/login" className="w-full mt-2">
                <Button className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold py-3 rounded-xl hover:bg-[#e0a400] transition-all flex items-center justify-center gap-2">
                  <LogIn size={18} /> Sign In to Auction11
                </Button>
              </Link>
            </div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <XCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-white">Verification Link Expired or Invalid</h2>
              <p className="text-xs text-red-300 leading-relaxed max-w-[320px]">{errorMessage}</p>

              <div className="flex flex-col w-full gap-3 mt-2">
                <Button
                  onClick={handleManualCheck}
                  className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold py-3 rounded-xl hover:bg-[#e0a400] transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} /> Try Again / Check Status
                </Button>

                {auth.currentUser && (
                  <button
                    onClick={handleResendEmail}
                    disabled={resendCooldown > 0 || isResending}
                    className="text-xs text-[#ffba00] hover:underline font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5 py-1"
                  >
                    <RefreshCw size={12} className={isResending ? "animate-spin" : ""} />
                    {resendCooldown > 0 ? `Resend link in ${resendCooldown}s` : "Resend New Verification Email"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen bg-[#072460] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#ffba00]/30 border-t-[#ffba00] rounded-full animate-spin" />
      </main>
    }>
      <EmailVerifiedContent />
    </Suspense>
  );
}

