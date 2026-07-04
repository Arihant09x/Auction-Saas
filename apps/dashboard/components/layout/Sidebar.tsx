// components/ui/Sidebar.tsx (or wherever your Sidebar is)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    SquarePlus,
    List,
    LogIn,
    MonitorDot,
    User,
    ChevronLeft,
    ChevronRight,
    Info,
} from "lucide-react";

interface SidebarProps {
    isMobileMenuOpen?: boolean;
    onMobileMenuToggle?: (open: boolean) => void;
    onExpandedChange?: (expanded: boolean) => void; // new: notify parent about desktop expand/collapse
}

export function Sidebar({ isMobileMenuOpen, onMobileMenuToggle, onExpandedChange }: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [windowWidth, setWindowWidth] = useState(0);
    const pathname = usePathname();

    const isDesktop = windowWidth >= 1024;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const isMobile = windowWidth < 768;

    // Notify parent when desktop expansion changes
    useEffect(() => {
        if (isDesktop && onExpandedChange) {
            onExpandedChange(isExpanded);
        }
    }, [isExpanded, isDesktop, onExpandedChange]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // On mobile/tablet, never show inline; on desktop, use isExpanded
    const inlineExpanded = isDesktop && isExpanded;

    const links = [
        { href: "/dashboard/organizer", label: "Dashboard", icon: Home },
        { href: "/dashboard/create-auction", label: "New Auction", icon: SquarePlus },
        { href: "/dashboard/my-auction", label: "My Auction", icon: List },
        { href: "/dashboard/join-auction", label: "Join Auction", icon: LogIn },
        { href: "/dashboard/auctions/panel", label: "Auction Panel", icon: MonitorDot },
        { href: "/dashboard/profile", label: "My Profile", icon: User },
        { href: "/dashboard/about", label: "About Us", icon: Info },
    ];

    const sidebarContent = (
        <aside
            className={`bg-[#FCFCFC] border-r border-[#EBEBEB] shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 relative shrink-0 z-40 ${isDesktop ? (isExpanded ? "w-[260px]" : "w-[80px]") : "w-[260px]"
                }`}
            style={{ minHeight: "calc(100vh - 79px)" }}
        >
            <div className="flex flex-col py-2 h-full">
                {/* Desktop toggle button */}
                {isDesktop && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute -right-4 top-10 bg-white border border-[#EBEBEB] rounded-full p-1 shadow-md hover:bg-gray-50 flex items-center justify-center text-[#012972]"
                    >
                        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                )}

                <nav className="flex flex-col gap-2 mt-4 flex-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                href={link.href}
                                key={link.href}
                                onClick={() => {
                                    if (!isDesktop && onMobileMenuToggle) onMobileMenuToggle(false);
                                }}
                                className={`flex items-center mx-4 py-3 px-3 rounded-lg transition-colors overflow-hidden ${isActive
                                    ? "bg-[#012972] text-white shadow-[0_4px_10px_rgba(1,41,114,0.3)]"
                                    : "text-[#012972]/70 hover:bg-[#012972]/5 hover:text-[#012972]"
                                    }`}
                            >
                                <Icon size={22} className="shrink-0" />
                                <span
                                    className={`ml-4 font-semibold text-[15px] leading-none whitespace-nowrap transition-opacity duration-200 ${inlineExpanded || !isDesktop ? "opacity-100 w-auto" : "opacity-0 w-0"
                                        }`}
                                >
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );

    // Desktop: render inline
    if (isDesktop) return sidebarContent;

    // Mobile/Tablet: off-canvas overlay
    return (
        <>
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={() => onMobileMenuToggle?.(false)}
                />
            )}
            <div
                className={`fixed top-[79px] left-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebarContent}
            </div>
        </>
    );
}