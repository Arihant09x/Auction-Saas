"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuctions } from "../../../hooks/useAuctions";
import { Loader2, Plus, Calendar, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "sonner";

const PLAN_PRIORITY: Record<string, number> = {
    FREE: 0,
    BASIC: 1,
    STANDARD: 2,
    PREMIUM: 3,
    ELITE: 4,
    ULTIMATE: 5,
    MEGA: 6
};

function SelectAuctionPaymentContent() {
    const router = useRouter();
    const { data: auctions = [], isLoading, isError } = useAuctions();
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const { isInitialized } = useAuthStore();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const plan = params.get("plan") || "PREMIUM";
            setSelectedPlan(plan.toUpperCase());
        }
    }, []);

    const handleAuctionSelect = (auction: any) => {
        const currentTier = (auction.planTier || "FREE").toUpperCase();
        const targetTier = selectedPlan.toUpperCase();
        
        const currentPriority = PLAN_PRIORITY[currentTier] ?? 0;
        const targetPriority = PLAN_PRIORITY[targetTier] ?? 0;

        if (currentPriority >= targetPriority && targetTier !== "FREE") {
            toast.info(`Your auction "${auction.name}" is already on the ${auction.planTier} plan, which is equal to or higher than the selected ${selectedPlan} plan.`);
            return;
        }

        router.push(`/dashboard/manage/${auction.id}/payment?upgrade=${selectedPlan}`);
    };

    if (isLoading || !isInitialized) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center flex-col gap-3 font-['Poppins']">
                <Loader2 className="h-10 w-10 animate-spin text-[#012972]" />
                <p className="text-gray-500 font-medium">Loading your auctions...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-12 text-center font-['Poppins']">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Something went wrong</h3>
                <p className="text-sm text-gray-500 mt-2">Failed to load auctions. Please check your connection and try again.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto py-10 px-4 font-['Poppins'] bg-transparent">
            <div className="mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold mb-3">
                    <ShieldCheck size={14} />
                    <span>Upgrading to {selectedPlan} Plan</span>
                </div>
                <h1 className="text-3xl font-extrabold text-[#012972]">Select an Auction to Upgrade</h1>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Choose which of your auctions you would like to upgrade to the <strong className="text-[#012972]">{selectedPlan}</strong> plan.</p>
            </div>

            {auctions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-150 p-10 text-center shadow-sm flex flex-col items-center gap-5">
                    <div className="w-16 h-16 bg-[#012972]/5 rounded-full flex items-center justify-center text-[#012972]">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">No Auctions Found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">You first need to create an auction before you can upgrade to the {selectedPlan} plan.</p>
                    </div>
                    <Link href={`/dashboard/create-auction?plan=${selectedPlan}`}>
                        <button className="bg-[#012972] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-blue-800 transition flex items-center gap-2 cursor-pointer border-none">
                            <Plus size={16} /> Create New Auction
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {auctions.map((auction: any) => (
                        <div
                            key={auction.id}
                            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                                        {auction.logo ? (
                                            <img src={auction.logo} alt={auction.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src="/icon1.png" alt={auction.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#012972] border border-blue-100 uppercase">
                                        {auction.planTier}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{auction.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                                    <Calendar size={14} />
                                    <span>{new Date(auction.auctionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAuctionSelect(auction)}
                                className="w-full py-2.5 rounded-xl bg-[#012972] text-white hover:bg-blue-800 transition font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm border-none"
                            >
                                Select & Upgrade <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SelectAuctionPaymentPage() {
    return (
        <Suspense fallback={<div className="flex h-[60vh] w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#012972]" /></div>}>
            <SelectAuctionPaymentContent />
        </Suspense>
    );
}
