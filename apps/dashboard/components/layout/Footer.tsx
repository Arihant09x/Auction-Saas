"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Twitter, Instagram, Youtube, Linkedin, Facebook } from "lucide-react";
import { GlobalBackground } from "../ui/GlobalBackground";
import { motion } from "framer-motion";
import Image from "next/image";

const ThreadsIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-threads" viewBox="0 0 16 16" {...props}>
        <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
    </svg>
);

export function Footer() {
    const MAIN_WEBSITE_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001";

    const socialLinks = [
        { icon: Twitter, href: "https://x.com/auction11_live", label: "X (Twitter)" },
        { icon: Instagram, href: "https://www.instagram.com/auction11.live?igsh=MXVqODY4Yzk4dHhxaQ==", label: "Instagram" },
        { icon: Youtube, href: "https://youtube.com/@auction11.live.official?si=Bau0WzuhvL55azp1", label: "YouTube" },
        { icon: ThreadsIcon, href: "https://www.threads.com/@auction11.live", label: "Threads" },
        { icon: Linkedin, href: "https://www.linkedin.com/company/auction11/", label: "LinkedIn" },
        { icon: Facebook, href: "https://www.facebook.com/share/1D3DdzLSbq/", label: "Facebook" },
    ];

    const quickLinks = [
        { label: "About Us", href: `${MAIN_WEBSITE_URL}/#about` },
        { label: "Today's Auctions", href: `/today-auction` },
        { label: "Upcoming Auctions", href: `/upcoming-auction` },
        { label: "Pricing", href: `/pricing` },
        { label: "Blogs", href: `${MAIN_WEBSITE_URL}/blogs` },
        { label: "Contact Us", href: `${MAIN_WEBSITE_URL}/#contact` },
    ];

    return (
        <footer className="relative pt-20 pb-10 overflow-hidden" style={{ background: "#012972" }}>
            <GlobalBackground variants="footer" />
            <div className="absolute top-0 left-0 w-full h-[1px] z-10" style={{ background: "rgba(255,255,255,0.15)" }} />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
            >
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:gap-8">

                    {/* Brand */}
                    <div className="flex flex-col items-start gap-4">
                        <Link
                            href="/"
                            className="block focus:outline-none focus:ring-2 focus:ring-[#FFBA00] rounded-lg mt-2 lg:mt-6"
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
                                    className="object-contain"
                                />
                            </motion.div>
                        </Link>
                        <p className="text-white/80 text-[13px] mt-2 max-w-xs leading-relaxed">
                            Powering smarter, faster, and more transparent player auctions for local and professional sports tournaments.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col ml-0 md:ml-[10%]">
                        <h4 className="text-white font-bold text-[16px] mb-6 font-['Poppins'] tracking-wide">Quick Links</h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-[13px] text-white/90 hover:text-[#FFBA00] transition-colors font-medium">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div className="flex flex-col ml-0 md:ml-[5%]">
                        <h4 className="text-white font-bold text-[16px] mb-6 font-['Poppins'] tracking-wide">Follow Us On</h4>
                        <ul className="space-y-4">
                            {socialLinks.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-[13px] text-white/90 hover:text-[#FFBA00] transition-colors font-medium group"
                                    >
                                        <social.icon size={16} className="text-white/80 group-hover:text-[#FFBA00] transition-colors" />
                                        <span>{social.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col ml-0 md:ml-[-5%]">
                        <h4 className="text-white font-bold text-[16px] mb-6 font-['Poppins'] tracking-wide">Contact</h4>
                        <ul className="space-y-5">
                            <li className="flex items-center gap-3">
                                <Phone size={16} color="white" className="shrink-0" />
                                <span className="text-[13px] text-white font-medium">+91 80731 82649</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} color="white" className="shrink-0" />
                                <a href="mailto:auction11.live@gmail.com" target="_blank" className="text-[13px] text-white hover:text-[#FFBA00] transition-colors font-medium">auction11.live@gmail.com</a>
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
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[14px] text-white/70 font-medium font-['Poppins']">
                        © {new Date().getFullYear()} Auction 11. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                        <a href={`${MAIN_WEBSITE_URL}/privacy-policy`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/70 hover:text-[#FFBA00] transition-colors font-medium font-['Poppins']">
                            Privacy Policy
                        </a>
                        <a href={`${MAIN_WEBSITE_URL}/terms-and-conditions`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/70 hover:text-[#FFBA00] transition-colors font-medium font-['Poppins']">
                            Terms & Conditions
                        </a>
                        <a
                            href={`${MAIN_WEBSITE_URL}/cancellation-policy`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[14px] text-white/70 hover:text-[#FFBA00] transition-colors font-medium font-['Poppins']"
                        >
                            Cancellation & Refund Policy
                        </a>
                        <a
                            href={`${MAIN_WEBSITE_URL}/shipping-policy`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[14px] text-white/70 hover:text-[#FFBA00] transition-colors font-medium font-['Poppins']"
                        >
                            Shipping & Delivery Policy
                        </a>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}

