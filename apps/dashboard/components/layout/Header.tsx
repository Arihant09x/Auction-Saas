"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User2, LogOut, Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/auth.store";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { toast } from "sonner";

const MAIN_WEBSITE_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001";
const Dashboard_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
const LOGIN_URL = `${MAIN_WEBSITE_URL}/login`;

const NAV_LINKS = [
    { href: `/today-auction`, label: "Today Auction" },
    { href: `/upcoming-auction`, label: "Upcoming Auction" },
    { href: `/pricing`, label: "Pricing" },
    { href: `${MAIN_WEBSITE_URL}/blogs`, label: "Blogs" },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user, logout, isHydrated, setUser, isAuthenticated, isLoading, firebaseToken } = useAuthStore();

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "bid-arena-auth" && !e.newValue) {
                window.location.reload();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Show placeholder while hydrating
    if (!isHydrated) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#012972] shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] lg:h-[69px] flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <Image src="/final-1.png" alt="Auction 11 Logo" width={140} height={55} className="h-10 w-auto lg:h-[55px]" priority />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                </div>
            </header>
        );
    }

    const handleLogout = async (allDevices = false) => {
        setShowLogoutModal(false);
        toast.success("Logging out... Redirecting...");

        if (allDevices && firebaseToken) {
            try {
                const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
                await fetch(`${wsUrl}/auth/logout-all-devices`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${firebaseToken}`,
                        "Content-Type": "application/json"
                    }
                });
            } catch (err) {
                console.error("Failed to revoke tokens on all devices:", err);
            }
        }

        try {
            if (auth && typeof auth.signOut === "function") {
                await signOut(auth);
            }
        } catch (err) {
            console.error("Firebase signout error:", err);
        }
        logout();
        if (typeof window !== "undefined") {
            localStorage.removeItem("bid-arena-auth");
            setTimeout(() => {
                window.location.href = LOGIN_URL;
            }, 1000);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 font-['Poppins']">
            <div className="bg-[#012972] shadow-[0px_4px_18px_rgba(0,0,0,0.15)] border-b border-[#8a8989ff]">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[64px] lg:h-[69px]">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href={Dashboard_URL}>
                                <Image
                                    src="/final-1.png"
                                    alt="Auction 11 Logo"
                                    width={140}
                                    height={55}
                                    className="h-10 w-auto lg:h-[55px]"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Desktop navigation + user area */}
                        <div className="hidden lg:flex items-center gap-2">
                            <nav className="flex items-center gap-2">
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="px-5 py-2 text-white font-bold text-base rounded-[10px] hover:bg-white/10 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>

                            {user ? (
                                <div className="flex items-center gap-2 bg-white/10 rounded-full pl-2 pr-4 py-1 border border-white/20">
                                    {(user as any).profileUrl ? (
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm">
                                            <img
                                                src={(user as any).profileUrl}
                                                alt={(user as any).name || "Avatar"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffba00] to-[#ff9100] flex items-center justify-center text-[#012972] font-extrabold text-sm shadow-sm">
                                            {(user as any).name ? (user as any).name.charAt(0).toUpperCase() : <User2 size={16} />}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-bold leading-tight">
                                            {(user as any).name || "User"}
                                        </span>
                                        <button
                                            onClick={() => setShowLogoutModal(true)}
                                            className="text-[#ffba00] text-[10px] leading-tight hover:underline cursor-pointer text-left"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : null}



                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed top-[64px] left-0 right-0 bottom-0 bg-[#012972]/95 backdrop-blur-md z-40"
                    >
                        <div className="flex flex-col py-6 px-4 space-y-2">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-4 text-white font-bold text-lg rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}

                            {user ? (
                                <div className="flex items-center justify-between mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-3">
                                        {(user as any).profileUrl ? (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                <img
                                                    src={(user as any).profileUrl}
                                                    alt={(user as any).name || "Avatar"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffba00] to-[#ff9100] flex items-center justify-center text-[#012972] font-extrabold text-base">
                                                {(user as any).name ? (user as any).name.charAt(0).toUpperCase() : <User2 size={18} />}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-bold text-base">
                                                {(user as any).name || "User"}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setShowLogoutModal(true);
                                                    setMenuOpen(false);
                                                }}
                                                className="text-[#ffba00] text-sm flex items-center gap-1 mt-1"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border border-gray-100 rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl font-poppins relative overflow-hidden"
                        >
                            {/* Decorative Accent Strip */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#012972] to-[#ffba00]" />

                            <div className="w-16 h-16 bg-[#012972]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#012972]">
                                <LogOut size={28} />
                            </div>

                            <h3 className="text-2xl font-black text-[#012972] mb-2 uppercase tracking-wide">Logout of Auction 11</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                You are about to log out of your session. Would you like to sign out from <strong>this browser tab only</strong>, or revoke active sessions on <strong>all devices</strong>?
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleLogout(false)}
                                    className="w-full py-3.5 bg-[#012972] text-white rounded-2xl font-bold hover:bg-[#00205b] transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer border-none text-sm"
                                >
                                    Logout from This Device
                                </button>
                                <button
                                    onClick={() => handleLogout(true)}
                                    className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer border-none text-sm"
                                >
                                    Logout from All Devices
                                </button>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full py-3.5 bg-gray-100 text-gray-700 hover:bg-gray-255 rounded-2xl font-bold transition-all active:scale-[0.98] cursor-pointer border-none text-sm hover:bg-gray-200"
                                >
                                    Stay Logged In
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}