"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Wallet, Gavel, CheckCircle, RefreshCw, Trophy } from "lucide-react";

export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: any = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };


    const features = [
        { icon: Users, title: "Player Registration", desc: "Easily add, manage, and organise player entries in one place." },
        { icon: Wallet, title: "Team Budgets", desc: "Set budgets for each team – the system tracks every rupee spent." },
        { icon: Gavel, title: "Live Bidding", desc: "Real‑time bids, no delays, no confusion – just fair, fast auctions." },
        { icon: CheckCircle, title: "Squad Creation", desc: "Auto‑generated team squads after the auction, ready to share." },
        { icon: RefreshCw, title: "Instant Updates", desc: "Everyone sees bid changes, remaining budgets, and sold players live." },
        { icon: Trophy, title: "Works for Any Event", desc: "From local leagues to big tournaments – scales with your needs." },
    ];

    return (
        <div className="relative w-full min-h-full flex flex-col pb-16 font-sans">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/organizer" className="hover:text-[#012972]">Dashboard</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">About Us</span>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-10 max-w-4xl"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants}>
                    <div className="mb-2">
                        <span className="text-sm font-medium text-[#0C3278] tracking-wide">10+ years of experience</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                        About Auction 11
                    </h1>
                    <p className="text-gray-600 text-base leading-relaxed mt-4 max-w-3xl">
                        Built from <span className="font-semibold text-gray-900">10+ years of manually managing sports tournaments</span>, our player auction app is
                        designed to solve the real challenges organizers face during player auctions. From spreadsheets and budget confusion
                        to delayed bid updates, we experienced the chaos firsthand – which is why we created a smarter solution.
                    </p>
                </motion.div>

                {/* Solution block */}
                <motion.div variants={itemVariants} className="border-t border-gray-100 pt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Player Auction Software</h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                        Our player auction software helps organizers manage player registrations, team budgets, live bidding, and squad
                        creation from one easy platform. With real-time updates, automatic calculations, and smooth cricket auction live
                        functionality, tournaments can run faster and more professionally. Whether you're organizing a local cricket league
                        or a large multi-team event, the platform simplifies every step of the auction process and delivers a seamless
                        experience for organizers, teams, and players.
                    </p>
                </motion.div>

                {/* Features Grid – clean, no colored backgrounds */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">What Makes It Different</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, i) => (
                            <motion.div
                                variants={itemVariants}
                                key={i}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-200"
                            >
                                <feat.icon size={20} className="text-gray-500 mb-3" strokeWidth={1.5} />
                                <h3 className="text-base font-semibold text-gray-900 mb-1">{feat.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Simple Footer */}
                <motion.div variants={itemVariants} className="border-t border-gray-100 pt-6 mt-2">
                    <p className="text-xs text-gray-400 text-center">
                        Designed by organizers, for organizers – making cricket auctions effortless.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}