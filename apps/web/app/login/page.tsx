"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowRight, UserPlus, LogIn, Upload, Image as ImageIcon } from "lucide-react";
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
} from "firebase/auth";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().regex(/^[0-9]{10,15}$/, "Invalid mobile number. Enter 10-15 digits."),
  city: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the Terms & Conditions and Privacy Policy"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]; // Strict checking for jpg/png to prevent hacking

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", mobile: "", city: "", acceptTerms: false },
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
      setFileError("Max image size is 5MB.");
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const res = await fetch(`${backendUrl}/auth/register`, {
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
        let errorMsg = "Failed to sync structural user data to the database.";
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
        throw new Error("Server is taking a moment to start up. Please try logging in again.");
      }
      throw err;
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setLoading(true);

    try {
      let profileUrl = null;
      if (profileFile) {
        profileUrl = await uploadToCloudinary(profileFile);
      }

      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await cred.user.getIdToken();

      const dbPayload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        city: data.city || null,
        profileUrl: profileUrl,
        password: data.password, // Optional backup
        role: "USER"
      };

      await syncUserToDatabase(cred.user.uid, dbPayload, idToken);

      // Redirect seamlessly to Dashboard
      toast.success("Welcome! Your account has been created.");
      window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=/dashboard/organizer`;
    } catch (err: any) {
      console.error("Registration error:", err);
      let message = "We couldn't create your account. Please try again.";

      // Handle Firebase specific errors
      if (err.code === "auth/email-already-in-use") {
        message = "This email address is already registered. Please log in instead.";
      } else if (err.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (err.code === "auth/weak-password") {
        message = "The password is too weak.";
      } else if (err.message) {
        // This handles our backend ConflictException messages (mobile exists, etc)
        message = err.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, data.email, data.password);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const idToken = await cred.user.getIdToken();

      // Ensure DB knows user logged in or explicitly perform /api/auth/login
      const res = await fetch(`${backendUrl}/auth/login`, {
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

      toast.success("Glad to see you back! Opening your dashboard...");

      if (role === "ADMIN") {
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=/admin`;
      } else {
        window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=/dashboard/organizer`;
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
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

      toast.success("Successfully signed in with Google!");
      window.location.href = `${DASHBOARD_URL}/auth/sync?token=${idToken}&next=/dashboard/organizer`;
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user" || err.message?.includes("popup-closed-by-user")) {
        toast.error("Sign-in window was closed. Please try again.");
      } else {
        toast.error(err.message || "Failed to sign in with Google. Please try again.");
      }
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
        className="w-full max-w-[450px] relative z-10 py-1-"
      >
        <div className="flex flex-col items-center mt-10  ">
          <Link href="/">
            <Image src="/final-1.png" alt="Auction 11 Logo" width={220} height={60} className="object-contain" />
          </Link>
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold text-white font-['Poppins']">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[#88a9e5] text-sm mt-2 mb-5">
              Connect to start managing your auctions
            </p>
          </div>
        </div>

        <div className="bg-[#0a2060]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.8 }}
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
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                      }`}
                  />
                  {loginForm.formState.errors.email && <p className="text-[#fe7c0a] text-xs mt-1">{loginForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-1 block">Password</label>
                  <input
                    {...loginForm.register("password")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${loginForm.formState.errors.password
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                      }`}
                  />
                  {loginForm.formState.errors.password && <p className="text-[#fe7c0a] text-xs mt-1">{loginForm.formState.errors.password.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full font-epilogue bg-[#ffba00] text-[#012972] font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#e0a400] transition-all mt-2 flex gap-2 items-center justify-center disabled:opacity-70">
                  {loading ? <div className="w-5 h-5 border-2 border-[#012972]/30 border-t-[#012972] rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
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
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
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
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
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
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                      }`}
                  />
                  {registerForm.formState.errors.email && <p className="text-[#fe7c0a] text-[10px] mt-1">{registerForm.formState.errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-1 block">Password <span className="text-red-500">*</span></label>
                    <input
                      {...registerForm.register("password")}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none transition-all ${registerForm.formState.errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:ring-2 focus:ring-[#ffba00]/50 focus:border-[#ffba00]"
                        }`}
                    />
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
          </AnimatePresence>

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
        </div>

        <div className="mt-6 text-center text-white/60 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => { setIsLogin(!isLogin); setProfileFile(null); registerForm.reset(); loginForm.reset(); }} className="text-[#ffba00] font-semibold hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
