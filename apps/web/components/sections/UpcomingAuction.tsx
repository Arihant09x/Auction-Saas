"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

import { Calendar, Users, IndianRupee, Trophy } from "lucide-react";

export function UpcomingAuctionSection() {
    const { data, isLoading } = useQuery({
        queryKey: ["landing-upcoming-auctions"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/auction/upcoming?page=1&limit=8`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            return json.data?.data || [];
        },
        staleTime: Infinity,
    });

    if (isLoading) {
        return (
            <section id="upcoming" className="clip-diagonal-both clip-pad-both" style={{ background: "#012972", color: "#ffffff" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!data || data.length === 0) return null; // Don't show if no upcoming auctions

    const fallbackImage = "https://tse1.mm.bing.net/th/id/OIP.gSkpI5uIEa8Qxa_qfvSSpwHaHa?pid=Api&P=0&w=300&h=300";

    return (
        <section
            id="upcoming"
            className="clip-diagonal-both clip-pad-both"
            style={{ background: "#012972", color: "#ffffff" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="divider-brand" />
                            <span
                                className="text-xs font-bold uppercase tracking-widest"
                                style={{ color: "#ffba00" }}
                            >
                                Coming Soon
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white">
                            Upcoming <span style={{ color: "#ffba00" }}>Auction</span>
                        </h2>
                    </div>
                    <a
                        href={`/upcoming-auction`}
                        className="text-sm font-semibold shrink-0 hover:underline underline-offset-4"
                        style={{ color: "#ffba00" }}
                    >
                        View All Upcoming →
                    </a>
                </div>

                {/* 4-column grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.map((a: any) => (
                        <a
                            key={a.id}
                            href={`${DASHBOARD_URL}/auction/${a.id}`}
                            className="group rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 block flex flex-col h-full"
                            style={{
                                background: "linear-gradient(145deg, #0a2060 0%, #0d44b5 100%)",
                                border: "1px solid rgba(255,255,255,0.09)",
                                boxShadow: "0 4px 24px rgba(1,41,114,0.40)",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg relative overflow-hidden shrink-0 border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.07)]">
                                    <img src={a.logo || fallbackImage} alt={a.name} className="object-cover w-full h-full" />
                                </div>
                                <div className="min-w-0 pr-2">
                                    <p className="font-bold text-white text-sm truncate leading-tight">{a.name}</p>
                                    <p className="text-[11px] truncate flex items-center gap-1 mt-0.5" style={{ color: "#8ea8d8" }}>
                                        <Calendar size={10} />
                                        {new Date(a.auctionDate).toLocaleDateString()} · {a.auctionStartTime || "TBD"}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
                                <div className="flex flex-col items-center p-2 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)]">
                                    <div className="flex items-center gap-1 text-[#8ea8d8] mb-1">
                                        <Trophy size={14} />
                                    </div>
                                    <p className="text-sm font-black text-white">{a._count?.teams || 0}</p>
                                </div>
                                <div className="flex flex-col items-center p-2 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)]">
                                    <div className="flex items-center gap-1 text-[#8ea8d8] mb-1">
                                        <Users size={14} />
                                    </div>
                                    <p className="text-sm font-black text-white">{a._count?.players || 0}</p>
                                </div>
                                <div className="col-span-2 flex flex-col items-center p-2 rounded-lg border border-[rgba(255,186,0,0.3)] bg-[rgba(255,186,0,0.1)]">
                                    <div className="flex items-center gap-1 text-[#ffba00] mb-1">
                                        <IndianRupee size={14} />
                                    </div>
                                    <p className="text-sm font-black text-[#ffba00]">{a.budgetPerTeam ? Number(a.budgetPerTeam).toLocaleString('en-IN') : "0"}</p>
                                </div>
                            </div>

                            <div
                                className="flex items-center justify-between pt-3 mt-auto"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
                            >
                                <span className="text-[11px]" style={{ color: "#8ea8d8" }}>View Details</span>
                                <svg
                                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                                    style={{ color: "#ffba00" }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
