"use client";

import { useQuery } from "@tanstack/react-query";


const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

import { Calendar, Users, IndianRupee, Trophy } from "lucide-react";

function LeagueCard({ a }: { a: any }) {
    const fallbackImage = "https://tse1.mm.bing.net/th/id/OIP.gSkpI5uIEa8Qxa_qfvSSpwHaHa?pid=Api&P=0&w=300&h=300";

    return (
        <a 
            href={`${DASHBOARD_URL}/auction/${a.id}`}
            className="card-light rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full block"
        >
            {/* Card header — dark navy */}
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "#012972" }}>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full relative overflow-hidden shrink-0 border border-[rgba(255,186,0,0.30)] bg-[rgba(255,186,0,0.12)]">
                        <img src={a.logo || fallbackImage} alt={a.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0 pr-2">
                        <p className="text-white font-bold text-sm leading-tight truncate">{a.name}</p>
                        <p className="text-[11px] truncate flex items-center gap-1 mt-0.5" style={{ color: "#8ea8d8" }}>
                            <Calendar size={10} />
                            {new Date(a.auctionDate).toLocaleDateString()} · {a.auctionStartTime || "TBD"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="px-4 py-4 flex-1 flex flex-col justify-between">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col items-center p-2 bg-[#f0f5ff] rounded-lg border border-[#d6e4ff]">
                        <div className="flex items-center gap-1 text-[#4a6090] mb-1">
                            <Trophy size={14} />
                        </div>
                        <p className="text-sm font-black text-[#012972]">{a._count?.teams || 0}</p>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-[#f0f5ff] rounded-lg border border-[#d6e4ff]">
                        <div className="flex items-center gap-1 text-[#4a6090] mb-1">
                            <Users size={14} />
                        </div>
                        <p className="text-sm font-black text-[#012972]">{a._count?.players || 0}</p>
                    </div>
                    <div className="col-span-2 flex flex-col items-center p-2 bg-[#fffdf0] rounded-lg border border-[#ffeeb3]">
                        <div className="flex items-center gap-1 text-[#b38200] mb-1">
                            <IndianRupee size={14} />
                        </div>
                        <p className="text-sm font-black text-[#b38200]">{a.budgetPerTeam ? Number(a.budgetPerTeam).toLocaleString('en-IN') : "0"}</p>
                    </div>
                </div>

                <div className="mt-auto">
                    <div
                        className="w-full text-center py-2.5 rounded-lg font-bold text-sm transition-all duration-200"
                        style={{
                            background: "#012972",
                            color: "#ffffff",
                        }}
                    >
                        View Details →
                    </div>
                </div>
            </div>
        </a>
    );
}

export function TodaysAuctionSection() {
    const { data, isLoading } = useQuery({
        queryKey: ["landing-today-auctions"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/auction/today?page=1&limit=4`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            return json.data?.data || [];
        },
        staleTime: Infinity,
    });

    if (isLoading) {
        return (
            <section id="todays-auction" className="section-white py-16 lg:py-20" style={{ marginTop: "-2px" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012972]"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!data || data.length === 0) return null; // Don't show the section if no today auctions

    return (
        <section
            id="todays-auction"
            className="section-white py-16 lg:py-20"
            style={{ marginTop: "-2px" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="divider-brand" />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#fe7c0a" }}>Live Now</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black heading-light">
                            Today&apos;s <span style={{ color: "#ffba00" }}>Auction</span>
                        </h2>
                    </div>
                    <a
                        href="/today-auction"
                        className="text-sm font-semibold hover:underline underline-offset-4 shrink-0"
                        style={{ color: "#0d44b5" }}
                    >
                        View All Today&apos;s Auctions →
                    </a>
                </div>

                {/* Carousel / 4-col grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {data.map((a: any) => <LeagueCard key={a.id} a={a} />)}
                </div>
            </div>
        </section>
    );
}
