"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, UserPlus } from "lucide-react";
import { Button } from "@repo/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";

const NAV_LINKS = [
    { href: "/today-auction", label: "Today’s Auction" },
    { href: "/upcoming-auction", label: "Upcoming Auction" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blogs", label: "Blogs" },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && menuOpen) setMenuOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [menuOpen]);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [menuOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 font-['Poppins']">
            {/* Main Navbar Container - border only on large screens */}
            <div className="relative bg-[#012972] shadow-[0px_4px_18px_rgba(0,0,0,0.15)] border-b border-[#8a8989ff] lg:border-b lg:border-[#8a8989ff]">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[64px] lg:h-[69px]">
                        {/* Logo – responsive sizing */}
                        <div className="flex items-center">
                            <Link href="/" className="block lg:hidden" aria-label="Home">
                                <Image
                                    src="/final-1.png"
                                    alt="Auction 11 Logo"
                                    width={140}
                                    height={55}
                                    className="h-10 lg:h-[55px] w-auto"
                                    priority
                                />
                            </Link>

                            <div className="hidden lg:block">
                                <Link href="/">
                                    <Image
                                        src="/final-1.png"
                                        alt="Auction 11 Logo"
                                        width={140}
                                        height={55}
                                        className="h-[55px] w-auto"
                                        priority
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-5 py-2 text-white font-bold text-base rounded-[10px] hover:bg-white/10 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Button
                                href="/login"
                                className="flex items-center gap-2 border border-[#0C3278] font-bold text-[15px] px-6 py-2 font-epilogue transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-[#FFBA00] focus:outline-none"
                                style={{
                                    background: "#FFBA00",
                                    color: "#012972",
                                    borderRadius: "99px",
                                }}
                            >
                                Login
                                <UserPlus size={20} className="pb-0.5" />
                            </Button>
                        </nav>

                        {/* Mobile hamburger button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFBA00]"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay + Slide-in */}
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
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-4 text-white font-bold text-lg rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Button
                                href="/login"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full border border-[#0C3278] font-bold text-[15px] px-6 py-3 font-epilogue transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:ring-2 focus:ring-[#FFBA00] focus:outline-none mt-4"
                                style={{
                                    background: "#FFBA00",
                                    color: "#012972",
                                    borderRadius: "99px",
                                }}
                            >
                                Login
                                <UserPlus size={20} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}