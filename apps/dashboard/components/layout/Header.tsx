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
const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3001/login";

const NAV_LINKS = [
    { href: `${MAIN_WEBSITE_URL}/today-auction`, label: "Today Auction" },
    { href: `${MAIN_WEBSITE_URL}/upcoming-auction`, label: "Upcoming Auction" },
    { href: `${MAIN_WEBSITE_URL}/blog`, label: "Blog" },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout, isHydrated, setUser, isAuthenticated, isLoading } = useAuthStore();



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

    const handleLogout = async () => {
        toast.success("Logged out successfully! Redirecting...");
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
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                                            onClick={handleLogout}
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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                                    handleLogout();
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
        </header>
    );
}