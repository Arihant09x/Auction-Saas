"use client";

import { useRef, useEffect, useState } from "react";
import { Plus, Clock, ChevronLeft, ChevronRight, LogIn, List, MonitorDot, CreditCard, Loader2, Calendar, BookOpen, ExternalLink } from "lucide-react";
import { GlowCard } from "../../../components/ui/GlowCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "../../../store/auth.store";
import { useAuctions } from "../../../hooks/useAuctions";
import { useQuery } from "@tanstack/react-query";
import { blogsApi, BlogArticle } from "../../../lib/api-client";

export default function OrganizerDashboard() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { user, isInitialized } = useAuthStore();
    const { data: auctions = [], isLoading: loadingAuctions } = useAuctions();
    const fallbackImage = "/icon1.png"
    const { data: blogsResponse, isLoading: loadingBlogs } = useQuery({
        queryKey: ["organizer-dashboard-blogs"],
        queryFn: () => blogsApi.getBlogs(1, 6),
        staleTime: 60000,
    });
    const blogs = Array.isArray(blogsResponse?.data?.data) ? blogsResponse.data.data : [];



    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
        }
    };

    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    return (
        <div className="w-full max-w-[1240px] mx-auto font-['Poppins']">

            {/* 
                Desktop: 5 Columns, 7 Rows Grid 
                Mobile: Flex Column 
            */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col xl:grid gap-6 xl:gap-[24px]"
                style={{
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(7, minmax(0, auto))'
                }}>

                {/* DIV 1: Hero & Quick Actions (Spans 3 Cols, 4 Rows) */}
                <motion.div variants={itemVariants} className="xl:col-span-3 xl:row-span-4 flex flex-col gap-6 h-full">
                    {/* Welcome Hero Card */}
                    <div
                        className="rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between items-start border border-[#3b5998]"
                        style={{
                            background: "linear-gradient(93deg, #012972 27.89%, #224B94 61.11%, #456EBB 96.4%)",
                            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                            flex: "1 1 auto"
                        }}
                    >
                        <div className="flex flex-col gap-2 z-10 mt-8 w-full sm:w-[75%] relative">
                            <h1 className="text-white text-[25px] font-extrabold font-epilogue leading-tight tracking-wide">Hi {(user as any)?.name ? (user as any).name.split(" ")[0] : ""}, Welcome to Auction 11</h1>
                            <h2 className="text-white text-[16px] font-bold font-epilogue mt-1">The Ultimate Cricket Auction Software</h2>
                            <p className="text-white/80 text-[13px] mt-2 leading-relaxed">Powering smarter, faster, and more transparent cricket auctions</p>
                        </div>

                        <Link href="/dashboard/create-auction" className="z-10 mt-6 sm:mt-0 sm:absolute sm:top-20 sm:right-8 w-full sm:w-auto">
                            <button className="w-full sm:w-auto mb-3 bg-[#0C3278] border border-[#FFBA00] text-white px-6 py-2.5 rounded-[100px] text-sm font-semibold flex items-center justify-center gap-3 hover:bg-[#082254] cursor-pointer transition-colors whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.2)] active:scale-95">
                                <Plus size={16} /> New Auction
                            </button>
                        </Link>


                        {/* Quick Actions 2x2 Grid */}
                        <div className="grid grid-cols-1 w-full sm:grid-cols-2 gap-4 h-[250px] mb-10">
                            {[
                                { label: "Join Auction", icon: LogIn, href: "/dashboard/join-auction" },
                                { label: "My Auction", icon: List, href: "/dashboard/my-auction" },
                                { label: "Auction Panel", icon: MonitorDot, href: "/dashboard/auctions/panel" },
                                { label: "View Plans", icon: CreditCard, href: `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/pricing` },
                            ].map((action, i) => {
                                const Icon = action.icon;
                                return (
                                    <Link href={action.href} key={i}>
                                        <button
                                            className="w-full bg-gradient-to-r from-[#6e85b3] to-[#8FA2CC] p-4 lg:p-6 rounded-2xl cursor-pointer flex items-center justify-center gap-3 text-white hover:brightness-105 transition-all outline outline-[1px] outline-white/40 outline-offset-[0px] h-full active:scale-95"
                                        >
                                            <Icon size={24} className="text-white shrink-0" strokeWidth={1.5} />
                                            <span className="font-extrabold text-[16px] lg:text-[19px] whitespace-nowrap drop-shadow-sm">{action.label}</span>
                                        </button>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* DIV 2: Your Auctions (Spans 2 Cols, 2 Rows, Starts at Col 4) */}
                <motion.div variants={itemVariants} className="xl:col-span-2 xl:row-span-2 xl:col-start-4 flex flex-col bg-[#fffafa] rounded-[16px] border border-black/5 shadow-sm overflow-hidden h-full">
                    <div className="px-5 py-4 flex justify-between items-center" style={{ background: 'linear-gradient(91deg, #FFF1CD 1.97%, #FFBA00 124.97%)' }}>
                        <h3 className="text-black font-extrabold text-[18px] tracking-tight m-0">Your Auctions</h3>
                    </div>

                    {/* Inline Carosuel Area */}
                    <div className="p-3 flex items-center gap-2 h-full">
                        <ChevronLeft className="cursor-pointer shrink-0 text-gray-500 hover:text-black transition-colors" size={28} onClick={scrollLeft} />

                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto custom-scrollbar snap-x w-full py-2 hide-scrollbar scroll-smooth"
                        >
                            {loadingAuctions ? (
                                <div className="w-full flex items-center justify-center h-full text-[#ffba00]"><Loader2 className="animate-spin" size={32} /></div>
                            ) : auctions.length === 0 ? (
                                <>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-fit h-20 bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-gray-100 shadow-sm gap-4">
                                        <p className="text-gray-500 font-semibold  text-md">You have no auctions created yet.</p>
                                    </motion.div>
                                </>
                            ) : (
                                Array.isArray(auctions) && auctions.map((auction: any) => (
                                    <Link href={`/dashboard/manage/${auction.id}/details`} key={auction.id}>
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="min-w-[155px] h-full  cursor-pointer bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100 snap-center shadow-sm shrink-0"
                                        >
                                            <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                                                {auction.logo ? <img src={auction.logo} alt="Logo" className="w-full h-full object-cover" /> : (
                                                    <img src={fallbackImage} alt="Auction" className="w-full h-full object-cover"></img>
                                                )}
                                            </div>
                                            <p className="text-[13px] font-extrabold text-[#012972] text-center leading-tight">{auction.name}</p>
                                            <div className="text-[10px] text-gray-500 mt-2 font-medium flex flex-col  items-center gap-1">
                                                <span className="flex flex-row gap-1"><Calendar size={12} />{new Date(auction.auctionDate).toLocaleDateString('en-GB')}</span>
                                                <span className="flex flex-row gap-1"><Clock size={12} />{auction.auctionStartTime}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))
                            )}
                        </div>

                        <ChevronRight className="cursor-pointer shrink-0 text-gray-500 hover:text-black transition-colors" size={28} onClick={scrollRight} />
                    </div>
                </motion.div>

                {/* DIV 3: Latest Blogs (Spans 2 Cols, 2 Rows, Starts at Col 4, Row 3) */}
                <motion.div variants={itemVariants} className="xl:col-span-2 xl:row-span-2 xl:col-start-4 xl:row-start-3 flex flex-col bg-[#fffafa] rounded-[16px] border border-black/5 shadow-sm overflow-hidden h-[280px]">
                    <div className="px-5 py-4 shrink-0 flex justify-between items-center" style={{ background: 'linear-gradient(91deg, #FFF1CD 1.97%, #FFBA00 124.97%)' }}>
                        <h3 className="text-black font-extrabold text-[18px] tracking-tight m-0">Latest Sports News</h3>
                        <a href={`${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/blog`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-800 hover:text-black flex items-center gap-1">
                            View All <ExternalLink size={12} />
                        </a>
                    </div>
                    {/* Vertical Scroll for Blogs */}
                    <div className="p-5 flex flex-col gap-3 overflow-y-auto custom-scrollbar h-[210px]">
                        {loadingBlogs ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-xl p-3 flex gap-4 items-center border border-gray-100 shadow-sm shrink-0">
                                    <div className="w-[75px] h-[55px] bg-gray-100 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-150 rounded w-5/6" />
                                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                                    </div>
                                </div>
                            ))
                        ) : blogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                                <BookOpen size={24} className="text-gray-300 mb-1" />
                                <span className="text-xs font-bold">No news at the moment</span>
                            </div>
                        ) : (
                            blogs.map((article: BlogArticle) => (
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={article.id}
                                    className="bg-white rounded-xl p-3 flex gap-4 items-center border border-gray-100 shadow-sm shrink-0 hover:border-[#0C3278]/20 transition-all hover:shadow-md group"
                                >
                                    <div className="w-[75px] h-[55px] bg-gray-100 rounded-lg shrink-0 overflow-hidden relative border border-gray-50">
                                        <img
                                            src={article.imageUrl || "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200"}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-extrabold text-gray-900 group-hover:text-[#0C3278] transition-colors leading-snug tracking-tight line-clamp-2">
                                            {article.title}
                                        </p>
                                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Recently"}
                                        </span>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* DIV 8: How to Get Started (Spans 5 Cols, 3 Rows, Starts at Row 5) */}
                <motion.div variants={itemVariants} className="xl:col-span-5 xl:row-span-3 xl:row-start-5 flex flex-col bg-[#fffafa] rounded-[16px] border border-black/5 shadow-sm overflow-hidden h-full">
                    <div className="px-6 py-5 shrink-0" style={{ background: 'linear-gradient(91deg, #FFF1CD 1.97%, #FFBA00 124.97%)' }}>
                        <h3 className="text-black font-extrabold text-[20px] tracking-tight m-0">How to Get Started in 5 Steps</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 h-full content-center">
                        {[
                            { step: 1, title: "Create Your Free Account", desc: "Sign up with your email or mobile number and access your auction dashboard instantly.", icon: "➔" },
                            { step: 2, title: "Set Up Your Tournament", desc: "Add tournament details, team budgets, and bidding rules in a few simple steps.", icon: "🔨" },
                            { step: 3, title: "Add Teams & Invite Owners", desc: "Add teams and send invite links so team owners can join and bid live.", icon: "🪙" },
                            { step: 4, title: "Register & Categorize Players", desc: "Add players manually or share the registration link. Set categories and base prices easily.", icon: "💳" },
                            { step: 5, title: "Go Live & Start the Auction", desc: "Launch your live auction and manage bids, budgets, and team updates automatically.", icon: "⏳" },
                        ].map((s) => (
                            <GlowCard key={s.step} className="bg-white h-[155px] shadow-sm">
                                <div className="flex flex-col w-full text-left p-1 h-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-[34px] h-[34px] bg-[#29519A] text-white rounded-[6px] flex items-center justify-center font-bold text-[16px]">
                                            {s.icon}
                                        </div>
                                        <span className="text-[#012972] font-extrabold text-[14px]">STEP {s.step}</span>
                                    </div>
                                    <h4 className="text-[13px] font-extrabold text-gray-800 mb-1 leading-tight">{s.title}</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight font-medium w-fit ">{s.desc}</p>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
