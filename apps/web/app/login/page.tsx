"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, UserPlus, LogIn, Upload, EyeOff, Eye, KeyRound, MailCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { uploadImage } from "@/app/actions/cloudinary";

import { ParticlesBackground } from "@/components/ui/ParticlesBackground";
import { Button } from "@repo/ui/button";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser
} from "firebase/auth";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ✅ Import posthog wrapper
import { posthog } from "@/lib/posthog";

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().regex(/^[0-9]{10,15}$/, "Enter valid 10-15 digit mobile number."),
  city: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the Terms & Conditions and Privacy Policy"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const formatE164 = (mobile: string): string => {
  let cleaned = mobile.trim();
  if (cleaned.startsWith('+')) return cleaned;
  if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
  return `+${cleaned}`;
};

export default function LoginPage() {
  const [viewMode, setViewMode] = useState<"login" | "register" | "forgot">("login");
  const [regStep, setRegStep] = useState<"details" | "verify_sent">("details");

  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Email verification cooldown
  const [cooldown, setCooldown] = useState(0);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const sanitizeReturnUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    const trimmed = url.trim();
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("/\\") ||
      trimmed.toLowerCase().startsWith("javascript:") ||
      trimmed.toLowerCase().startsWith("data:")
    ) {
      return "";
    }
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
    try {
      const parsed = new URL(trimmed);
      const host = parsed.host.toLowerCase();
      const allowedHosts = [
        "localhost:3000",
        "localhost:3001",
        "localhost:3002",
        "auction11.live",
        "www.auction11.live",
        "dashboard.auction11.live",
      ];
      if (allowedHosts.includes(host)) {
        return parsed.pathname + parsed.search + parsed.hash;
      }
    } catch (e) {
      return "";
    }
    return "";
  };

  const getActionCodeSettings = () => ({
    url: process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_URL || "https://auction11.live/auth/email-verified",
    handleCodeInApp: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const rawParam = params.get("redirect") || params.get("next") || params.get("returnUrl");
      const safePath = sanitizeReturnUrl(rawParam);
      if (safePath) {
        setRedirectUrl(safePath);
      }
    }
  }, []);

  // Cooldown countdown timer for resend verification email
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const getNextPath = (url: string) => {
    const safe = sanitizeReturnUrl(url);
    return safe || "/dashboard/organizer";
  };

  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", mobile: "", city: "", acceptTerms: false },
  });

  const forgotForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError("Only strictly .jpg or .png formats are allowed.");
      setProfileFile(null);
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("Max image size is 2MB.");
      setProfileFile(null);
      e.target.value = '';
      return;
    }

    setProfileFile(file);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    return await uploadImage(formData);
  };

  const syncUserToDatabase = async (firebaseUid: string, data: any, idToken: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          firebaseUid,
          ...data,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMsg = "Failed to sync user profile to database.";
        try {
          const errorData = await res.json();
          if (errorData.message) {
            errorMsg = Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.message;
          }
        } catch (e) { }
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error("Server connection timed out. Please try again.");
      }
      throw err;
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    let createdUser: any = null;

    try {
      // 1. Upload Profile Picture if selected
      let profileUrl = null;
      if (profileFile) {
        profileUrl = await uploadToCloudinary(profileFile);
      }

      // 2. Create Firebase Account
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      createdUser = cred.user;

      // 2.1 Set displayName in Firebase Auth BEFORE sending verification email
      await updateProfile(createdUser, { displayName: data.name });

      // 3. Send Firebase Email Verification with custom ActionCodeSettings
      await sendEmailVerification(createdUser, getActionCodeSettings());
      setCooldown(60);
      setRegisteredEmail(data.email);

      const idToken = await createdUser.getIdToken();

      const dbPayload = {
        name: data.name,
        email: data.email,
        mobile: formatE164(data.mobile),
        city: data.city || null,
        profileUrl: profileUrl,
        password: data.password,
        role: "USER"
      };

      // 4. Sync initial user profile to PostgreSQL DB (emailVerified will default to false)
      await syncUserToDatabase(createdUser.uid, dbPayload, idToken);

      setRegStep("verify_sent");
      toast.success("Account created! A verification email has been sent to your inbox.");
    } catch (err: any) {
      console.error("Registration error:", err);

      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (cleanupErr) { }
      }

      let message = "We couldn't create your account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email address is already registered. Please sign in instead.";
      } else if (err.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (err.code === "auth/weak-password") {
        message = "The password is too weak.";
      } else if (err.message) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmailVerification = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        toast.error("Session expired. Please log in.");
        setViewMode("login");
        setLoading(false);
        return;
      }

      // Reload Firebase user state
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        const freshIdToken = await auth.currentUser.getIdToken(true);

        // Notify NestJS backend to set emailVerified = true in PostgreSQL
        const res = await fetch(`${BACKEND_URL}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${freshIdToken}`
          }
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to update email verification status.");
        }

        posthog.identify(auth.currentUser.uid, {
          email: auth.currentUser.email,
          role: "USER",
          plan: "free",
        });

        toast.success("Email verified successfully! Welcome to Auction11.");
        const nextPath = redirectUrl ? getNextPath(redirectUrl) : "/dashboard/organizer";
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${freshIdToken}&next=${encodeURIComponent(nextPath)}`;
      } else {
        toast.info("Email is not verified yet. Please check your inbox and click the link inside the email.");
      }
    } catch (err: any) {
      console.error("Check email verification error:", err);
      toast.error(err.message || "Failed to check email verification status.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, getActionCodeSettings());
        setCooldown(60);
        toast.success("Verification email resent! Please check your inbox.");
      } else {
        toast.error("No active session found. Please try logging in.");
        setViewMode("login");
      }
    } catch (err: any) {
      console.error("Resend email verification error:", err);
      if (err.code === "auth/too-many-requests") {
        toast.error("Too many resend requests. Please wait a few minutes.");
      } else {
        toast.error(err.message || "Failed to resend verification email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
      });

      if (!res.ok) {
        let errorMsg = "Database verification failed. Try again.";
        try {
          const errorData = await res.json();
          if (errorData.message) {
            errorMsg = Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.message;
          }
        } catch (e) { }
        throw new Error(errorMsg);
      }
      const dbUser = await res.json();
      const role = dbUser.role || "USER";

      posthog.identify(cred.user.uid, {
        email: cred.user.email,
        role: role,
        plan: "free",
      });

      toast.success("Glad to see you back! Opening your dashboard...");

      if (role === "ADMIN") {
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=/admin`;
      } else {
        const nextPath = redirectUrl ? getNextPath(redirectUrl) : "/dashboard/organizer";
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=${encodeURIComponent(nextPath)}`;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      let message = "Invalid email or password. Please check your details.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        message = "Incorrect email or password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed login attempts. Please try again later.";
      } else if (err.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection.";
      } else if (err.message) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();

      const dbPayload = {
        name: cred.user.displayName || "Google User",
        email: cred.user.email,
        mobile: null,
        city: null,
        profileUrl: cred.user.photoURL || null,
        role: "USER"
      };

      await syncUserToDatabase(cred.user.uid, dbPayload, idToken);

      const roleRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
      });
      const dbUser = roleRes.ok ? await roleRes.json() : {};
      const role = dbUser?.data?.role || dbUser?.role || "USER";

      posthog.identify(cred.user.uid, {
        email: cred.user.email,
        role: role,
        plan: "free",
      });

      toast.success("Successfully signed in with Google!");

      if (role === "ADMIN") {
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=/admin`;
      } else {
        const nextPath = redirectUrl ? getNextPath(redirectUrl) : "/dashboard/organizer";
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=${encodeURIComponent(nextPath)}`;
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      let message = "Failed to sign in with Google. Please try again.";
      if (err.code === "auth/popup-closed-by-user" || err.message?.includes("popup-closed-by-user")) {
        message = "Sign-in window was closed. Please try again.";
      } else if (err.code === "auth/cancelled-popup-request") {
        message = "Only one sign-in window can be open at a time.";
      } else if (err.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection.";
      } else if (err.message) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("If an eligible account exists with this email, a password reset link has been sent.");
      forgotForm.reset();
      setViewMode("login");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      toast.success("If an eligible account exists with this email, a password reset link has been sent.");
      setViewMode("login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#072460] overflow-y-auto flex items-center justify-center p-4">
      <Toaster theme="dark" position="top-center" richColors />
      <ParticlesBackground />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0d44b5]/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[450px] relative z-10 py-4"
      >
        <div className="flex flex-col items-center mt-2">
          <Link href="/">
            <Image src="/final-1.png" alt="Auction 11 Logo" width={220} height={60} className="object-contain" />
          </Link>
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold text-white font-['Poppins']">
              {viewMode === "login"
                ? "Welcome Back"
                : viewMode === "forgot"
                  ? "Reset Password"
                  : regStep === "verify_sent"
                    ? "Verify Your Email"
                    : "Create Account"}
            </h1>
            <p className="text-[#88a9e5] text-sm mt-2 mb-5">
              {viewMode === "forgot"
                ? "We will send a password reset link to your email"
                : regStep === "verify_sent"
                  ? `Verification link sent to ${registeredEmail || "your email"}`
                  : "Connect to start managing your auctions"}
            </p>
          </div>
        </div>

        <div className="bg-[#0a2060]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            {/* 1. LOGIN VIEW */}
            {viewMode === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-white/80 text-sm font-medium mb-1 block">Email Address</label>
                  <input
                    {...loginForm.register("email")}
                    type="email"
                    placeholder="example@email.com"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${loginForm.formState.errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                      : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                      }`}
                  />
                  {loginForm.formState.errors.email && <p className="text-[#fe7c0a] text-xs mt-1">{loginForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-white/80 text-sm font-medium">Password</label>
                    <button
                      type="button"
                      onClick={() => setViewMode("forgot")}
                      className="text-xs text-[#ffba00] hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      {...loginForm.register("password")}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${loginForm.formState.errors.password
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                        : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                    >
                      {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && <p className="text-[#fe7c0a] text-xs mt-1">{loginForm.formState.errors.password.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#e0a400] transition-all mt-2 flex gap-2 items-center justify-center disabled:opacity-70">
                  {loading ? <div className="w-5 h-5 border-2 border-[#012972]/30 border-t-[#012972] rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
                </Button>
              </motion.form>
            )}

            {/* 2. FORGOT PASSWORD VIEW */}
            {viewMode === "forgot" && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                onSubmit={forgotForm.handleSubmit(onForgotPasswordSubmit)}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-white/80 text-sm font-medium mb-1 block">Account Email Address</label>
                  <input
                    {...forgotForm.register("email")}
                    type="email"
                    placeholder="example@email.com"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${forgotForm.formState.errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                      : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                      }`}
                  />
                  {forgotForm.formState.errors.email && <p className="text-[#fe7c0a] text-xs mt-1">{forgotForm.formState.errors.email.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#e0a400] transition-all mt-2 flex gap-2 items-center justify-center disabled:opacity-70">
                  {loading ? <div className="w-5 h-5 border-2 border-[#012972]/30 border-t-[#012972] rounded-full animate-spin" /> : <><KeyRound size={18} /> Send Reset Link</>}
                </Button>

                <button
                  type="button"
                  onClick={() => setViewMode("login")}
                  className="text-white/60 hover:text-white text-xs flex items-center justify-center gap-1.5 mt-2 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </motion.form>
            )}

            {/* 3. REGISTER VIEW - STEP 1: DETAILS */}
            {viewMode === "register" && regStep === "details" && (
              <motion.form
                key="register-details"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-1 block">Name <span className="text-red-500">*</span></label>
                    <input
                      {...registerForm.register("name")}
                      type="text"
                      placeholder="John Doe"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${registerForm.formState.errors.name
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                        : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                        }`}
                    />
                    {registerForm.formState.errors.name && <p className="text-[#fe7c0a] text-[10px] mt-1">{registerForm.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-1 block">Mobile <span className="text-red-500">*</span></label>
                    <input
                      {...registerForm.register("mobile")}
                      type="tel"
                      placeholder="9876543210"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${registerForm.formState.errors.mobile
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                        : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                        }`}
                    />
                    {registerForm.formState.errors.mobile && <p className="text-[#fe7c0a] text-[10px] mt-1">{registerForm.formState.errors.mobile.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-1 block">Email Address <span className="text-red-500">*</span></label>
                  <input
                    {...registerForm.register("email")}
                    type="email"
                    placeholder="example@email.com"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${registerForm.formState.errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                      : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                      }`}
                  />
                  {registerForm.formState.errors.email && <p className="text-[#fe7c0a] text-[10px] mt-1">{registerForm.formState.errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-1 block">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        {...registerForm.register("password")}
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${registerForm.formState.errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                          : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                      >
                        {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && <p className="text-[#fe7c0a] text-[10px] mt-1">{registerForm.formState.errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-1 block">City (Optional)</label>
                    <input {...registerForm.register("city")} type="text" placeholder="Mumbai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]" />
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-1 block">Profile Picture (Optional)</label>
                  <div className="relative">
                    <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className={`w-full bg-white/5 border border-dashed rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all ${profileFile ? 'border-[#ffba00] text-[#ffba00]' : 'border-white/20 text-white/50 hover:border-white/40'}`}>
                      {profileFile ? <Check size={16} /> : <Upload size={16} />}
                      <span className="text-sm">{profileFile ? profileFile.name : 'Upload .jpg or .png'}</span>
                    </div>
                  </div>
                  {fileError && <p className="text-[#fe7c0a] text-[10px] mt-1">{fileError}</p>}
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <input {...registerForm.register("acceptTerms")} type="checkbox" id="acceptTerms" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-[#ffba00] cursor-pointer" />
                  <label htmlFor="acceptTerms" className="text-white/60 text-[12px] leading-tight cursor-pointer">
                    By creating an account, you agree to our <Link href="/terms-and-conditions" className="text-[#ffba00] hover:underline">Terms & Conditions</Link> and <Link href="/privacy-policy" className="text-[#ffba00] hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                {registerForm.formState.errors.acceptTerms && <p className="text-[#fe7c0a] text-[10px] mt-[-8px]">{registerForm.formState.errors.acceptTerms.message}</p>}

                <Button type="submit" disabled={loading} className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#e0a400] transition-all mt-2 flex gap-2 items-center justify-center disabled:opacity-70">
                  {loading ? <div className="w-5 h-5 border-2 border-[#012972]/30 border-t-[#012972] rounded-full animate-spin" /> : <><UserPlus size={18} /> Create Account</>}
                </Button>
              </motion.form>
            )}

            {/* 4. REGISTER VIEW - STEP 2: VERIFICATION EMAIL SENT */}
            {viewMode === "register" && regStep === "verify_sent" && (
              <motion.div
                key="register-verify-sent"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 text-center items-center py-2"
              >
                <div className="w-16 h-16 rounded-full bg-[#ffba00]/10 border border-[#ffba00]/30 flex items-center justify-center text-[#ffba00]">
                  <MailCheck size={32} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-white">Verification Email Sent</h3>
                  <p className="text-xs text-white/70 leading-relaxed max-w-[340px]">
                    We have sent a verification link to <span className="font-semibold text-white">{registeredEmail}</span>. Please check your inbox and verify your email before continuing.
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3 mt-2">
                  <Button
                    type="button"
                    onClick={handleCheckEmailVerification}
                    disabled={loading}
                    className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#e0a400] transition-all flex gap-2 items-center justify-center disabled:opacity-70"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-[#012972]/30 border-t-[#012972] rounded-full animate-spin" /> : <><CheckCircle2 size={18} /> I Have Verified My Email</>}
                  </Button>

                  <button
                    type="button"
                    onClick={handleResendVerificationEmail}
                    disabled={cooldown > 0 || loading}
                    className="text-xs text-[#ffba00] hover:underline font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5 py-1"
                  >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend Verification Email"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setViewMode("login"); setRegStep("details"); }}
                  className="text-white/60 hover:text-white text-xs flex items-center justify-center gap-1.5 mt-2 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GOOGLE SIGN IN BUTTON (Only shown on Login and Register Step 1) */}
          {viewMode !== "forgot" && regStep !== "verify_sent" && (
            <>
              <div className="mt-6 mb-6 flex items-center justify-center gap-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">OR</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <Button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white/5 border border-[#0C3278] hover:bg-white/10 text-white font-medium py-3.5 rounded-xl transition-all h-[48px] flex items-center justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-white/60 text-sm">
          {viewMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setViewMode(viewMode === "login" ? "register" : "login");
              setRegStep("details");
              setProfileFile(null);
              registerForm.reset();
              loginForm.reset();
              forgotForm.reset();
            }}
            className="text-[#ffba00] font-semibold hover:underline"
          >
            {viewMode === "login" ? "Sign up" : "Log in"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}