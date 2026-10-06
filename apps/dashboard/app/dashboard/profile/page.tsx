"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../store/auth.store";
import { useAuctions, useJoinedAuctions } from "../../../hooks/useAuctions";
import { User, Mail, Award, MapPin, Gavel, Users, Loader2, ShieldCheck, ShieldAlert, Lock, CheckCircle2, KeyRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { auth } from "../../../lib/firebase";
import { EmailAuthProvider, linkWithCredential, sendEmailVerification } from "firebase/auth";

export default function ProfilePage() {
    const { user, firebaseToken, setUser, isInitialized } = useAuthStore();
    const { data: createdAuctions = [], isLoading: loadingCreated } = useAuctions();
    const { data: joinedAuctions = [], isLoading: loadingJoined } = useJoinedAuctions();

    // Email verification state
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verifyLoading, setVerifyLoading] = useState(false);

    // Password Setting state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    if (!isInitialized || !user) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#012972]" size={32} />
            </div>
        );
    }

    const userData = {
        name: (user as any).name || "User",
        email: (user as any).email || "No email",
        uid: (user as any).id || "N/A",
        photoURL: (user as any).profileUrl || null,
        role: (user as any).role || "USER",
        phone: (user as any).mobile || "Not provided",
        phoneVerified: Boolean((user as any).phoneVerified),
        emailVerified: Boolean((user as any).emailVerified),
        authProvider: (user as any).authProvider || "email",
        city: (user as any).city || "Not provided",
        plan: (user as any).plan || "Organizer Plan",
        joinedDate: (user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
    };

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const handleResendEmail = async () => {
        if (resendCooldown > 0) return;
        setVerifyLoading(true);
        try {
            if (auth.currentUser) {
                const actionCodeSettings = {
                    url: process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_URL || "https://auction11.live/auth/email-verified",
                    handleCodeInApp: false,
                };
                await sendEmailVerification(auth.currentUser, actionCodeSettings);
                setResendCooldown(60);
                toast.success("Verification email resent! Please check your inbox.");
            } else {
                toast.error("Active session not found. Please try re-logging in.");
            }
        } catch (err: any) {
            console.error("Resend email error:", err);
            if (err.code === "auth/too-many-requests") {
                toast.error("Too many resend requests. Please wait a few minutes.");
            } else {
                toast.error(err.message || "Failed to resend verification email.");
            }
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleCheckEmailVerification = async () => {
        setVerifyLoading(true);
        try {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    const freshToken = await auth.currentUser.getIdToken(true);
                    const res = await fetch(`${BACKEND_URL}/auth/verify-email`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${freshToken}`
                        }
                    });

                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.message || "Failed to update email verification status.");
                    }

                    const updatedUser = await res.json();
                    setUser({ ...(user as any), ...updatedUser, emailVerified: true });
                    toast.success("Email verified successfully!");
                } else {
                    toast.info("Email is not verified yet. Please check your inbox and click the link inside the email.");
                }
            } else {
                toast.error("Active session not found. Please try re-logging in.");
            }
        } catch (err: any) {
            console.error("Check verification status error:", err);
            toast.error(err.message || "Failed to check email verification status.");
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setPasswordLoading(true);
        try {
            if (auth.currentUser) {
                try {
                    const cred = EmailAuthProvider.credential(userData.email, newPassword);
                    await linkWithCredential(auth.currentUser, cred);
                } catch (linkErr: any) {
                    if (linkErr.code !== "auth/provider-already-linked" && linkErr.code !== "auth/credential-already-in-use") {
                        console.warn("Firebase credential linking notice:", linkErr);
                    }
                }
            }

            const token = auth.currentUser ? await auth.currentUser.getIdToken(true) : firebaseToken;
            const res = await fetch(`${BACKEND_URL}/auth/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to set password.");
            }

            const updatedUser = await res.json();
            setUser({ ...(user as any), ...updatedUser, authProvider: updatedUser.authProvider || "google+email" });
            setShowPasswordForm(false);
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password configured successfully! You can now log in using Email & Password or Google.");
        } catch (err: any) {
            console.error("Set password error:", err);
            toast.error(err.message || "Failed to set password. Please try again.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants: any = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20 font-sans">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/organizer" className="hover:text-[#012972]">Dashboard</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">My Profile</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">My Profile</h1>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-[900px]">
                {/* Unverified Email Prompt Banner */}
                {!userData.emailVerified && (
                    <motion.div variants={itemVariants} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">Email Verification Required</h4>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    Your email address is currently unverified. Please verify your email to secure your account.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleResendEmail}
                                disabled={resendCooldown > 0 || verifyLoading}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <RefreshCw size={14} className={verifyLoading ? "animate-spin" : ""} />
                                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Email"}
                            </button>
                            <button
                                onClick={handleCheckEmailVerification}
                                disabled={verifyLoading}
                                className="bg-[#012972] hover:bg-[#072460] text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                            >
                                <CheckCircle2 size={14} /> Check Status
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Profile Header Card */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                        {userData.photoURL ? (
                            <img src={userData.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-gray-600 text-2xl font-bold uppercase">{userData.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex flex-col items-center sm:items-start gap-1">
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{userData.name}</h2>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <Mail size={14} className="text-gray-400" /> {userData.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-gray-50 uppercase">
                                {userData.role}
                            </span>
                            {userData.emailVerified ? (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-200 text-green-700 bg-green-50 flex items-center gap-1">
                                    <ShieldCheck size={12} /> Email Verified
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 text-amber-700 bg-amber-50 flex items-center gap-1">
                                    <ShieldAlert size={12} /> Unverified Email
                                </span>
                            )}
                            <span className="text-[10px] text-gray-400 font-medium">Since {userData.joinedDate}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Live Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <Award size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Plan</span>
                            <span className="text-base font-bold text-gray-800">{userData.plan}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <MapPin size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                            <span className="text-base font-bold text-gray-800">{userData.city}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <Gavel size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auctions Created</span>
                            <span className="text-base font-bold text-gray-800">
                                {loadingCreated ? (
                                    <Loader2 className="animate-spin text-gray-400" size={14} />
                                ) : (
                                    createdAuctions.length
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <Users size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auctions Joined</span>
                            <span className="text-base font-bold text-gray-800">
                                {loadingJoined ? (
                                    <Loader2 className="animate-spin text-gray-400" size={14} />
                                ) : (
                                    joinedAuctions.length
                                )}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Account Details */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-gray-500" strokeWidth={1.5} />
                            <h3 className="text-base font-bold text-gray-900">Account Details</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        <DetailRow label="Full Name" value={userData.name} />
                        <DetailRow label="Email Address" value={userData.email} verified={userData.emailVerified} onVerify={handleCheckEmailVerification} />
                        <DetailRow label="Mobile Number" value={userData.phone} />
                        <DetailRow label="Member Since" value={userData.joinedDate} />
                    </div>
                </motion.div>

                {/* Security Settings (Set Password / Account Linking) */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                            <Lock size={18} className="text-gray-500" strokeWidth={1.5} />
                            <h3 className="text-base font-bold text-gray-900">Security & Sign-In Methods</h3>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800">Authentication Provider</h4>
                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                    Primary sign-in method: <span className="font-bold text-[#012972]">{userData.authProvider}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="bg-[#012972] hover:bg-[#072460] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                            >
                                <KeyRound size={14} /> {showPasswordForm ? "Cancel" : "Set / Update Password"}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showPasswordForm && (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={handleSetPassword}
                                    className="p-5 border border-gray-200 rounded-xl bg-slate-50 flex flex-col gap-4 overflow-hidden"
                                >
                                    <h4 className="text-sm font-bold text-gray-900">Set Account Password</h4>
                                    <p className="text-xs text-gray-500">
                                        Setting a password links Email & Password authentication to your existing account. You can log in with Google or Email & Password anytime.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-700 mb-1 block">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012972]/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-700 mb-1 block">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012972]/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordForm(false)}
                                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="bg-[#012972] hover:bg-[#072460] text-white text-xs font-semibold px-5 py-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                                        >
                                            {passwordLoading ? <Loader2 size={14} className="animate-spin" /> : "Save Password"}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

function DetailRow({ label, value, verified, onVerify, className = "" }: { label: string; value: string; verified?: boolean; onVerify?: () => void; className?: string }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                {verified !== undefined && (
                    verified ? (
                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified
                        </span>
                    ) : (
                        <button onClick={onVerify} className="text-[10px] font-bold text-amber-600 hover:underline">
                            Check Verification
                        </button>
                    )
                )}
            </div>
            <span className="text-sm font-semibold text-gray-700 bg-gray-50/50 border border-gray-100/50 rounded-xl px-4 py-2.5 break-all">
                {value}
            </span>
        </div>
    );
}
