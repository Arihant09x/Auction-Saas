"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Twitter, Instagram, Youtube, Linkedin, Facebook } from "lucide-react";
import { GlobalBackground } from "../ui/GlobalBackground";
import { motion } from "framer-motion";
import Image from "next/image";

const ThreadsIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-threads" viewBox="0 0 16 16">
        <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
    </svg>
);

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, href: "https://x.com/auction11_live", label: "X (Twitter)" },
        { icon: Instagram, href: "https://www.instagram.com/auction11.live?igsh=MXVqODY4Yzk4dHhxaQ==", label: "Instagram" },
        { icon: Youtube, href: "https://youtube.com/@auction11.live.official?si=Bau0WzuhvL55azp1", label: "YouTube" },
        { icon: ThreadsIcon, href: "https://www.threads.com/@auction11.live", label: "Threads" },
        { icon: Linkedin, href: "https://www.linkedin.com/company/auction11/", label: "LinkedIn" },
        { icon: Facebook, href: "https://www.facebook.com/share/1D3DdzLSbq/", label: "Facebook" },

    ];

    const pageLinksCol1 = [
        { label: "New Auction", href: `${DASHBOARD_URL}/dashboard/create-auction` },
        { label: "Join Auction", href: `${DASHBOARD_URL}/dashboard/join-auction` },
        { label: "Auction Panel", href: `${DASHBOARD_URL}/dashboard/organizer` },
        { label: "My Auction", href: `${DASHBOARD_URL}/dashboard/my-auction` },
        { label: "About Us", href: "/#about" },
    ];

    const pageLinksCol2 = [
        { label: "Today's Auctions", href: "/today-auction" },
        { label: "Upcoming Auctions", href: "/upcoming-auction" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blogs", href: "/blogs" },
        { label: "Contact Us", href: "/#contact" },
    ];

    return (
        <footer className="relative pt-16 pb-8 overflow-hidden" style={{ background: "#012972" }}>
            <GlobalBackground variants="footer" />
            <div className="absolute top-0 left-0 w-full h-px z-10 bg-white/15" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
            >
                {/* Footer Grid - Fully Responsive */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Brand & Socials */}
                    <div className="flex flex-col items-start gap-4">
                        <Link
                            href="/"
                            className="block focus:outline-none focus:ring-2 focus:ring-[#FFBA00] rounded-lg mt-2 lg:mt-20"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                <Image
                                    src="/final-1.png"
                                    alt="Auction 11 Logo"
                                    width={220}
                                    height={220}
                                    className="object-contain ml-7"
                                />
                            </motion.div>
                        </Link>

                        <div className="flex gap-4 ">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="p-2 rounded-full text-white hover:text-[#FFBA00] hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2 focus:ring-offset-[#012972]"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Pages Column 1 */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5 font-['Poppins'] tracking-wide">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {pageLinksCol1.map((link) => (
                                <li key={link.label}>
                                    {link.href.startsWith("http") ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block py-2 text-sm text-white/90 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2 focus:ring-offset-[#012972] rounded-md"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="inline-block py-2 text-sm text-white/90 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2 focus:ring-offset-[#012972] rounded-md"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pages Column 2 */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5 font-['Poppins'] tracking-wide">
                            More Links
                        </h4>
                        <ul className="space-y-3">
                            {pageLinksCol2.map((link) => (
                                <li key={link.label}>
                                    {link.href.startsWith("http") ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block py-2 text-sm text-white/90 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2 focus:ring-offset-[#012972] rounded-md"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="inline-block py-2 text-sm text-white/90 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] focus:ring-offset-2 focus:ring-offset-[#012972] rounded-md"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-5 font-['Poppins'] tracking-wide">
                            Contact
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-center gap-3">
                                <Phone size={16} color="white" className="shrink-0" />
                                <span className="text-[13px] text-white font-medium">+91 80731 82649</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} color="white" className="shrink-0" />
                                <a href="mailto:auction11.live@gmail.com" target="_black" className="text-[13px] text-white hover:text-[#FFBA00] transition-colors font-medium">auction11.live@gmail.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={16} color="white" className="shrink-0 mt-0.5" />
                                <span className="text-[13px] text-white font-medium leading-relaxed">
                                    Karnataka, India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Legal Bar */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs sm:text-sm text-white/70 font-medium font-['Poppins'] text-center sm:text-left">
                        © {currentYear} Auction 11. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
                        <Link
                            href="/privacy-policy"
                            className="text-xs sm:text-sm text-white/70 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] rounded-md px-1"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-and-conditions"
                            className="text-xs sm:text-sm text-white/70 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] rounded-md px-1"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/cancellation-policy"
                            className="text-xs sm:text-sm text-white/70 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] rounded-md px-1"
                        >
                            Cancellation & Refund Policy
                        </Link>
                        <Link
                            href="/shipping-policy"
                            className="text-xs sm:text-sm text-white/70 hover:text-[#FFBA00] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FFBA00] rounded-md px-1"
                        >
                            Shipping & Delivery Policy
                        </Link>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}