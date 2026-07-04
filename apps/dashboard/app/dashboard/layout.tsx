"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Sidebar } from "../../components/layout/Sidebar";
import { AuthGuard } from "../../components/auth/AuthGuard";
import { Menu, Monitor } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const pathname = usePathname();
    const router = useRouter();

    const isDesktop = windowWidth >= 1024;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isDesktop && isMobileSidebarOpen) {
            setIsMobileSidebarOpen(false);
        }
    }, [isDesktop, isMobileSidebarOpen]);

    return (
        <div className="flex flex-col min-h-screen font-['Poppins'] overflow-hidden">
            <AuthGuard>
                <Navbar />

                <div className="flex flex-1 pt-[79px] relative">
                    {/* Sidebar – inline on desktop, off-canvas on mobile/tablet */}
                    <Sidebar
                        isMobileMenuOpen={isMobileSidebarOpen}
                        onMobileMenuToggle={setIsMobileSidebarOpen}
                        onExpandedChange={setIsSidebarExpanded}
                    />

                    {/* Main content – no margin-left on desktop because sidebar is inline */}
                    <main
                        className="flex-1 bg-[#F4F7FE] min-h-[calc(100vh-79px)] overflow-x-hidden transition-all duration-300"
                    >
                        {/* Mobile/Tablet header with hamburger button */}
                        {!isDesktop && (
                            <div className="sticky top-0 z-30 bg-gray-500/10 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
                                <button
                                    onClick={() => setIsMobileSidebarOpen(true)}
                                    className="p-2 rounded-md text-[#012972] hover:bg-gray-100 focus:outline-none"
                                    aria-label="Open menu"
                                >
                                    <Menu size={24} />
                                </button>
                                <h1 className="ml-3 text-lg font-bold text-gray-800">Dashboard</h1>
                            </div>
                        )}

                        <div className="p-4 md:p-6">{children}</div>
                    </main>
                </div>

                <Footer />
            </AuthGuard>
        </div>
    );
}