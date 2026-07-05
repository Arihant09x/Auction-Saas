"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { joinAuctionSchema, formatZodErrors } from "@/lib/validations";
import { Calendar, Clock, ArrowRight, Ticket } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function JoinAuctionPage() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [codeError, setCodeError] = useState("");

    const router = useRouter();
    const queryClient = useQueryClient();
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const fetchJoinedAuctions = async () => {
        if (!firebaseToken) return [];
        const res = await fetch(`${apiUrl}/auction/joined`, {
            headers: { Authorization: `Bearer ${firebaseToken}` },
        });
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                useAuthStore.getState().logout();
                window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/login`;
            }
            throw new Error("Failed to fetch joined auctions");
        }
        const data = await res.json();
        // TransformInterceptor usually wraps everything in { data: ... }
        return Array.isArray(data) ? data : (data.data || []);
    };

    const { data: joinedAuctions = [], isLoading: isFetching } = useQuery({
        queryKey: ['joinedAuctions'],
        queryFn: fetchJoinedAuctions,
        enabled: !!firebaseToken
    });

    // Animation variants
    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } } };



    const handleJoin = async (e: FormEvent) => {
        e.preventDefault();
        const result = joinAuctionSchema.safeParse({ code });
        if (!result.success) {
            const errMsg = result.error.issues[0]?.message || "Invalid code";
            setCodeError(errMsg);
            toast.error("Please enter a valid auction code.");
            return;
        }
        setCodeError("");

        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/auction/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${firebaseToken}`,
                },
                body: JSON.stringify({ code: code.trim() }),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    useAuthStore.getState().logout();
                    window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/login`;
                }
                const errData = await res.json();
                throw new Error(errData.message || "Invalid Auction Code");
            }

            const data = await res.json();

            // Re-fetch the joined auctions query so the user sees it in their list
            queryClient.invalidateQueries({ queryKey: ['joinedAuctions'] });

            toast.success("Great! You've successfully joined the auction.", {
                description: "Taking you to the auction panel now...",
            });

            setTimeout(() => {
                router.push(`/dashboard/auction-panel/${data.auctionId || data.data?.auctionId}`);
            }, 1000);

        } catch (error: any) {
            toast.error("We couldn't join the auction.", {
                description: "Please check the code and try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-full flex flex-col font-poppins">
            {/* Background Swooshes */}
            <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
                <div className="sticky top-0 w-full h-screen overflow-hidden">
                    <div className="absolute" style={{ width: "140px", height: "200vh", background: "linear-gradient(80deg, #08245E, #0A307F)", transform: "rotate(18deg)", left: "70%", top: "-20%" }} />
                    <div className="absolute" style={{ width: "140px", height: "200vh", background: "#0A307F", transform: "rotate(18deg)", left: "63%", top: "-20%", filter: "drop-shadow(0 4px 20px #000)" }} />
                </div>
            </div>

            <div className="relative z-10 flex flex-col w-full max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                    <Link href="/dashboard/organizer" className="hover:text-[#012972]">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#012972] font-semibold">Join Auction</span>
                </div>

                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-2xl sm:text-[32px] font-bold text-gray-900 drop-shadow-sm mb-6 px-2">
                    Join Auction
                </motion.h1>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col w-[100%] justify-center xl:flex-row gap-8 items-start">
                    {/* The Join Form Card */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full xl:w-[60%] mb-10">
                        <h2 className="text-xl sm:text-[26px] font-extrabold text-gray-900 mb-8 flex flex-wrap items-center gap-3">
                            <Ticket size={28} className="text-[#0C3278] shrink-0" />
                            {joinedAuctions.length > 0 ? "Join Another Auction" : "You Haven't Joined An Auction Yet!"}
                        </h2>

                        <form onSubmit={handleJoin} className="flex flex-col gap-4">
                            <label className="text-gray-600 font-semibold whitespace-nowrap text-sm">
                                Enter Code to Join Auction
                            </label>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex flex-col gap-1 flex-1 w-full">
                                    <input
                                        type="text"
                                        placeholder="Enter Code Here"
                                        value={code}
                                        onChange={(e) => { setCode(e.target.value); setCodeError(""); }}
                                        className={`w-full border rounded-md px-4 py-2.5 font-medium text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0C3278] focus:border-transparent transition-all ${codeError ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300'}`}
                                    />
                                    {codeError && <span className="text-[11px] text-red-500 font-medium mt-0.5">{codeError}</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#0C3278] border border-[#FFBA00] text-white px-10 py-2.5 rounded-[100px] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#082254] cursor-pointer transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Join Auction <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Joined Auctions List */}
                    {isFetching ? (
                        <motion.div variants={itemVariants} className="w-full xl:w-[40%] flex flex-col gap-4">
                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="flex flex-col gap-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 animate-pulse">
                                        <div className="h-3 w-20 bg-gray-200 rounded" />
                                        <div className="flex gap-3 items-center">
                                            <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl" />
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 w-32 bg-gray-200 rounded" />
                                                <div className="h-2 w-20 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="w-full xl:w-[40%] flex flex-col gap-4">
                            <h3 className="text-gray-800 xl:text-white font-bold text-xl drop-shadow-md px-1">Previously Joined</h3>
                            {joinedAuctions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                                    {joinedAuctions.map((auction: any, idx: number) => (
                                        <motion.div
                                            key={auction.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="bg-white rounded-2xl flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                                        >
                                            <div className="p-4 flex flex-col gap-3">
                                                <p className="text-[10px] font-bold text-gray-500">Code - {auction.auctionCode}</p>

                                                <div className="flex gap-3 items-center">
                                                    <div className="w-[50px] h-[50px] bg-[#0C3278] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                                        <div className="w-[35px] h-[35px] rounded-full border-[1.5px] border-white/50 bg-black/50 flex items-center justify-center text-white text-[6px] font-bold">
                                                            LOGO
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <h3 className="text-[14px] font-extrabold text-gray-900 leading-tight">
                                                            {auction.organizer?.name || "Unknown"}
                                                        </h3>
                                                        <div className="flex gap-4 text-[10px] text-gray-600 font-semibold mt-1">
                                                            <div className="flex items-center gap-1"><Calendar size={10} /> {new Date(auction.auctionDate).toLocaleDateString()}</div>
                                                            <div className="flex items-center gap-1"><Clock size={10} /> {auction.auctionStartTime || "TBD"}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-[1px] w-full bg-gray-100" />

                                                <div className="flex justify-between items-center text-[11px] font-bold text-gray-800">
                                                    <div className="flex gap-1 items-center"><span className="text-gray-500">Points</span> {auction.budgetPerTeam}</div>
                                                    <button
                                                        onClick={() => router.push(`/dashboard/auction-panel/${auction.id}`)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center text-gray-500 font-medium flex flex-col items-center justify-center min-h-[200px]">
                                    <Ticket size={40} className="text-gray-300 mb-3" />
                                    <p className="text-sm">You haven't joined any auctions yet.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
