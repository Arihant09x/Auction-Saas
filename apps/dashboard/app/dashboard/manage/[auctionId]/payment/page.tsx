"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useAuctionDetails } from "../../../../../hooks/useManageAuction";
import { usePayment } from "../../../../../hooks/usePayment";
import { PageSkeleton } from "../../../../../components/ui/PageSkeleton";
import {
    Crown, Check, Zap, Shield, Star,
    Sparkles, Loader2, ChevronRight, XCircle,
    Trophy, Users, ChevronDown, ChevronUp,
    AlertCircle
} from "lucide-react";

// --- Plan Tier Configuration ---
type PlanTierConf = {
    key: string; label: string; players: number; auctions: number; teams: number; price: number; originalPrice: number;
    icon: any; color: string; gradient: string; border: string; badge: string; isBestValue?: boolean;
    features: string[];
};

const PLAN_TIERS: PlanTierConf[] = [
    {
        key: "FREE", label: "Free", players: 100, auctions: 1, teams: 2, price: 0, originalPrice: 0,
        icon: Zap, color: "#e0e7f5", gradient: "from-gray-50 to-gray-100",
        border: "border-[#e0e7f5]", badge: "bg-gray-100 text-gray-600",
        features: ["1 Active Auction", "100 Players per Auction", "2 Teams per Auction", "Core Features"]
    },
    {
        key: "BASIC", label: "Basic", players: 200, auctions: 3, teams: 4, price: 1049, originalPrice: 1500,
        icon: Shield, color: "#00379d", gradient: "from-blue-50 to-indigo-50",
        border: "border-[#00379d]", badge: "bg-blue-100 text-blue-700",
        features: ["3 Active Auctions", "200 Players per Auction", "4 Teams per Auction", "Priority Support"]
    },
    {
        key: "STANDARD", label: "Standard", players: 400, auctions: 5, teams: 8, price: 1749, originalPrice: 2500,
        icon: Star, color: "#00379d", gradient: "from-blue-50 to-indigo-50",
        border: "border-[#00379d]", badge: "bg-emerald-100 text-emerald-700",
        features: ["5 Active Auctions", "400 Players per Auction", "8 Teams per Auction", "Custom Branding"]
    },
    {
        key: "PREMIUM", label: "Premium", players: 1200, auctions: 10, teams: 12, price: 2449, originalPrice: 3500,
        icon: Crown, color: "#FFBA00", gradient: "from-amber-50 to-yellow-50",
        border: "border-[#FFBA00]", badge: "bg-amber-100 text-amber-700", isBestValue: true,
        features: ["10 Active Auctions", "1200 Players per Auction", "12 Teams per Auction", "Real-time Analytics", "Master Dashboard"]
    },
    {
        key: "ELITE", label: "Elite", players: 2500, auctions: 25, teams: 16, price: 2799, originalPrice: 4000,
        icon: Sparkles, color: "#012972", gradient: "from-blue-50 to-indigo-50",
        border: "border-[#012972]", badge: "bg-violet-100 text-violet-700",
        features: ["25 Active Auctions", "2500 Players per Auction", "16 Teams per Auction", "Booster Pack Included", "Full Customization"]
    },
    {
        key: "ULTIMATE", label: "Ultimate", players: 5000, auctions: 42, teams: 20, price: 3849, originalPrice: 5500,
        icon: Trophy, color: "#012972", gradient: "from-blue-50 to-indigo-50",
        border: "border-[#012972]", badge: "bg-rose-100 text-rose-700",
        features: ["Unlimited Auctions", "5000 Players per Auction", "20 Teams per Auction", "Enterprise White-labeling", "Personal Account Manager"]
    },
    {
        key: "MEGA", label: "Mega", players: 10000, auctions: 60, teams: 30, price: 4899, originalPrice: 6999,
        icon: Trophy, color: "#012972", gradient: "from-blue-50 to-indigo-50",
        border: "border-[#012972]", badge: "bg-rose-100 text-rose-700",
        features: ["Unlimited Auctions", "10000 Players per Auction", "30 Teams per Auction", "Enterprise White-labeling", "Personal Account Manager"]
    }
];

const PLAN_PRIORITY: Record<string, number> = { FREE: 0, BASIC: 1, STANDARD: 2, PREMIUM: 3, ELITE: 4, ULTIMATE: 5, MEGA: 6 };

declare global { interface Window { Razorpay: any; } }

// Skeleton Component for Pricing Page
const PricingSkeleton = () => (
    <div className="w-full animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 w-64 bg-gray-300 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="h-6 w-24 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded mb-3"></div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="h-14 bg-gray-100 rounded"></div>
                        <div className="h-14 bg-gray-100 rounded"></div>
                        <div className="h-14 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    </div>
);

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const auctionId = params.auctionId as string;

    // Real Data Hooks
    const { data: auction, isLoading: isAuctionLoading, refetch: refetchAuction, isError: isAuctionError } = useAuctionDetails(auctionId);
    const { createOrder, verifyPayment, isProcessing, setIsProcessing } = usePayment(auctionId);

    const [view, setView] = useState<"PRICING" | "SUCCESS" | "FAILURE">("PRICING");
    const [errorMsg, setErrorMsg] = useState("");
    const [successData, setSuccessData] = useState<any>(null);
    const [processingPlanKey, setProcessingPlanKey] = useState<string | null>(null);
    const [activePolicy, setActivePolicy] = useState<"cancellation" | "shipping" | null>(null);
    const lastUpgradeCall = useRef<number>(0); // throttle

    // Global Error Handle
    useEffect(() => {
        if (isAuctionError) {
            toast.error("Our systems are currently busy. Please try again in a few minutes.", { id: "sys-down" });
        }
    }, [isAuctionError]);

    const currentPriority = PLAN_PRIORITY[auction?.planTier || "FREE"] || 0;
    const currentPrice = PLAN_TIERS.find(p => p.key === auction?.planTier)?.price || 0;

    const getCardState = (tierKey: string) => {
        const tierPriority = PLAN_PRIORITY[tierKey] ?? 0;
        if (tierKey === auction?.planTier) return "CURRENT";
        if (tierKey === "FREE") return "FREE";
        if (tierPriority < currentPriority) return "DOWNGRADE";
        return "UPGRADE";
    };

    const getUpgradePrice = (targetPrice: number) => {
        if (!auction?.isPaid) return targetPrice;
        return Math.max(0, targetPrice - currentPrice);
    };

    const getOriginalUpgradePrice = (targetOriginalPrice: number) => {
        if (!auction?.isPaid) return targetOriginalPrice;
        const currentOriginalPrice = PLAN_TIERS.find(p => p.key === auction?.planTier)?.originalPrice || 0;
        return Math.max(0, targetOriginalPrice - currentOriginalPrice);
    };

    const handleUpgrade = useCallback(async (tierKey: string) => {
        // Throttle: prevent rapid clicks
        const now = Date.now();
        if (now - lastUpgradeCall.current < 2000) {
            toast.info("Please wait before upgrading again.");
            return;
        }
        lastUpgradeCall.current = now;

        if (tierKey === "FREE") return;

        setIsProcessing(true);
        setProcessingPlanKey(tierKey);
        try {
            const orderData = await createOrder(tierKey);
            if (!orderData) {
                setIsProcessing(false);
                setProcessingPlanKey(null);
                return;
            }

            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Cricket Auction SaaS",
                description: `Upgrade to ${tierKey} Plan`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    toast.loading("Verifying payment...", { id: "payment-verify" });
                    const verifyResult = await verifyPayment(response, tierKey);

                    if (verifyResult.success) {
                        toast.success("Payment received! Your plan has been upgraded.", { id: "payment-verify" });
                        setSuccessData({
                            plan: tierKey,
                            amount: orderData.amount / 100,
                            orderId: orderData.orderId
                        });
                        setView("SUCCESS");
                        refetchAuction();
                    } else {
                        toast.error("Verification failed.", { id: "payment-verify" });
                        setErrorMsg(verifyResult.message || "We could not verify your payment with the backend. Please contact support if your amount was deducted.");
                        setView("FAILURE");
                    }
                    setIsProcessing(false);
                    setProcessingPlanKey(null);
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        setProcessingPlanKey(null);
                    }
                },
                prefill: {
                    name: "Auction Organizer",
                },
                theme: { color: "#012972" },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (res: any) => {
                setErrorMsg("The payment window was closed or the transaction failed.");
                setView("FAILURE");
                setIsProcessing(false);
                setProcessingPlanKey(null);
            });
            rzp.open();
        } catch (error: any) {
            toast.error("We couldn't start the payment process. Please try again.");
            setIsProcessing(false);
            setProcessingPlanKey(null);
        }
    }, [createOrder, verifyPayment, auction?.isPaid, currentPrice]);

    const hasTriggeredUpgrade = useRef(false);

    useEffect(() => {
        if (auction && !hasTriggeredUpgrade.current) {
            const params = new URLSearchParams(window.location.search);
            const upgradePlan = params.get("upgrade");
            if (upgradePlan) {
                const planKey = upgradePlan.toUpperCase();
                const matchedPlan = PLAN_TIERS.find(p => p.key === planKey);
                if (matchedPlan && planKey !== "FREE") {
                    const cardState = getCardState(planKey);
                    if (cardState === "UPGRADE") {
                        hasTriggeredUpgrade.current = true;
                        setTimeout(() => {
                            handleUpgrade(planKey);
                        }, 500);
                    }
                }
            }
        }
    }, [auction, handleUpgrade]);

    // --- Loading View ---
    if (isAuctionLoading || (!auction && !isAuctionError)) {
        return <PricingSkeleton />;
    }

    // --- Error View ---
    if (isAuctionError) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-700">Service Temporarily Unavailable</h3>
                <p className="text-sm text-gray-500 mt-2">We couldn't connect to the server. Please check your internet connection or come back shortly.</p>
            </div>
        );
    }

    // --- Success View (Minimal) ---
    if (view === "SUCCESS") {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h2>
                <p className="text-gray-500 mb-6">
                    Your auction <span className="font-bold">{auction?.name}</span> has been upgraded to <span className="font-bold text-[#012972]">{successData?.plan}</span> plan.
                </p>
                <button onClick={() => router.push(`/dashboard/manage/${auctionId}/details`)} className="bg-[#012972] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#00379d] transition-colors">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    // --- Failure View (Minimal) ---
    if (view === "FAILURE") {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
                <p className="text-gray-500 mb-6">{errorMsg || "Something went wrong. Please try again."}</p>
                <div className="flex gap-3">
                    <button onClick={() => setView("PRICING")} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                        Try Again
                    </button>
                    <button onClick={() => router.push(`/dashboard/manage/${auctionId}/details`)} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // --- Pricing View (Compact Cards with Expandable Features) ---
    // Helper component for each card (to manage expand state locally)
    const PlanCard = React.memo(({ tier, upgradePrice, originalUpgradePrice, isCurrent, isDowngrade, isFree, isProcessingThis, isBestValue, onUpgrade }: any) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-xl border transition-all duration-300 ${isBestValue ? "border-[#FFBA00] shadow-md" : "border-gray-200 shadow-sm"
                    } ${!isCurrent && !isDowngrade && !isFree ? "hover:shadow-lg hover:-translate-y-1" : "opacity-90"} bg-white ${isProcessingThis ? "opacity-70 pointer-events-none" : ""
                    }`}
            >
                <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className={`text-lg font-bold ${isBestValue ? "text-[#012972]" : "text-gray-800"}`}>
                            {tier.label}
                        </h3>
                        <div className="flex gap-2">
                            {isCurrent && (
                                <span className="flex justify-center items-center text-center text-xs bg-[#012972] text-white px-2 py-1 rounded-full font-medium shadow-sm">Current Plan </span>
                            )}
                            {isBestValue && !isCurrent && (
                                <span className="flex justify-center items-center text-center text-xs bg-[#FFBA00] text-[#012972] px-2 py-1 rounded-full font-medium">Best Value</span>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        {tier.price === 0 ? (
                            <span className="text-2xl font-bold text-gray-700">Free</span>
                        ) : (
                            <div className="flex flex-col gap-1.5 text-start">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900">₹{upgradePrice.toLocaleString()}</span>
                                    <span className="text-sm text-gray-400 line-through">₹{originalUpgradePrice.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500">Per-Auction</span>
                                </div>
                                {originalUpgradePrice > upgradePrice && (
                                    <div className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-[#00379d] text-white w-fit shadow-sm">
                                        You Save ₹{(originalUpgradePrice - upgradePrice).toLocaleString()} (30% off)
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="bg-[#012972]/5 border border-[#012972]/10 rounded-lg py-2.5 px-4 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Total Teams Allowed:</span>
                            <span className="text-sm font-extrabold text-[#012972] bg-[#012972]/10 px-3 py-0.5 rounded-full">{tier.teams} Teams</span>
                        </div>
                    </div>

                    <div className="mt-2">
                        {isCurrent ? (
                            <button disabled className="w-full py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-500 cursor-default">
                                Current Plan
                            </button>
                        ) : isDowngrade ? (
                            <button disabled className="w-full py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-400 cursor-default">
                                Downgrade Not Available
                            </button>
                        ) : isFree ? (
                            <button disabled className="w-full py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-500 cursor-default">
                                Free Plan
                            </button>
                        ) : (
                            <button
                                onClick={onUpgrade}
                                disabled={isProcessingThis}
                                className={`w-full py-2 text-sm font-medium rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isBestValue
                                    ? "bg-[#012972] text-white hover:bg-[#00379d] shadow-sm"
                                    : "bg-gray-800 text-white hover:bg-gray-900 shadow-sm"
                                    } ${isProcessingThis ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isProcessingThis ? <><Loader2 size={14} className="animate-spin" /> Processing</> : <>Upgrade Now</>}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    });
    PlanCard.displayName = 'PlanCard';

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20 font-sans">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/my-auction" className="hover:text-[#012972]">My Auction</Link>
                <span>/</span>
                <Link href={`/dashboard/manage/${auctionId}/details`} className="hover:text-[#012972]">Details</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">Upgrade Plan</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2">
                <div>
                    <h1 className="text-2xl font-bold text-[#012972]">Upgrade Plan</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">Current plan:</span>
                        <span className="font-semibold bg-[#012972]/10 text-[#012972] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            {auction?.planTier}
                        </span>
                        <span className="text-sm text-gray-500">• {auction?.name}</span>
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PLAN_TIERS.map((tier) => {
                    const state = getCardState(tier.key);
                    const upgradePrice = getUpgradePrice(tier.price);
                    const isCurrent = state === "CURRENT";
                    const isDowngrade = state === "DOWNGRADE";
                    const isFree = state === "FREE";
                    const isProcessingThis = isProcessing && processingPlanKey === tier.key;
                    const isBestValue = tier.isBestValue === true;

                    return (
                        <PlanCard
                            key={tier.key}
                            tier={tier}
                            upgradePrice={upgradePrice}
                            originalUpgradePrice={getOriginalUpgradePrice(tier.originalPrice)}
                            isCurrent={isCurrent}
                            isDowngrade={isDowngrade}
                            isFree={isFree}
                            isProcessingThis={isProcessingThis}
                            isBestValue={isBestValue}
                            onUpgrade={() => handleUpgrade(tier.key)}
                        />
                    );
                })}
            </div>

            {/* Simple Security Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-12 text-xs text-gray-400 border-t border-gray-100 pt-6">
                <div className="flex items-start justify-start gap-1 text-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex items-center text-center justify-center mt-1.5 shrink-0" ></span>
                    <p className="pt-0.5">Payments are processed securely via Razorpay. We do not store your payment information.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setActivePolicy("cancellation")}
                        className="hover:text-[#012972] cursor-pointer font-semibold underline transition-colors focus:outline-none"
                    >
                        Cancellation & Refund Policy
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        onClick={() => setActivePolicy("shipping")}
                        className="hover:text-[#012972] cursor-pointer font-semibold underline transition-colors focus:outline-none"
                    >
                        Shipping & Delivery Policy
                    </button>
                </div>
            </div>

            {/* Premium Policy Modals */}
            <AnimatePresence>
                {activePolicy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden font-sans text-start"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {activePolicy === "cancellation" ? "Cancellation & Refund Policy" : "Shipping & Delivery Policy"}
                                </h3>
                                <button
                                    onClick={() => setActivePolicy(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-gray-600 leading-relaxed scrollbar-thin">
                                {activePolicy === "cancellation" ? (
                                    <>
                                        <p className="font-semibold text-gray-800">
                                            {"Thank you for choosing Auction11. We are committed to providing a seamless and reliable auction experience. Please read this Cancellation & Refund Policy carefully before placing an order or subscribing to any of our Services. By using our Services and completing a purchase, you acknowledge and agree to the terms outlined in this policy."}
                                        </p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">1. Interpretation and Definitions</h4>
                                        <h5 className="font-semibold text-gray-900 mt-2">1.1 Interpretation</h5>
                                        <p>{"Capitalised terms used in this policy carry the meanings defined below and shall have the same interpretation whether they appear in singular or plural form."}</p>
                                        <h5 className="font-semibold text-gray-900 mt-2">1.2 Definitions</h5>
                                        <ul className="list-disc pl-5 space-y-2 mt-1">
                                            <li><strong>{"Company "}</strong>{"(referred to as \"we,\" \"us,\" or \"our\") refers to Auction11, an individual business operating from Belagavi, Karnataka, India."}</li>
                                            <li><strong>{"Order "}</strong>{"means a request placed by you to purchase or access any service offered by Auction11."}</li>
                                            <li><strong>{"You "}</strong>{"refers to the individual accessing, using, or placing an Order through our platform."}</li>
                                        </ul>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">2. Order Cancellation Policy</h4>
                                        <p>{"Once a service Order has been successfully placed and confirmed through the Auction11 platform, it is considered binding. As our Services are digital and delivered upon confirmation, orders generally cannot be cancelled once placed."}</p>
                                        <p>{"We strongly recommend that you review your selected service package carefully before confirming your purchase."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">3. Eligibility for Refund</h4>
                                        <p>{"While orders are non-cancellable by default, we recognise that exceptional circumstances may arise. A refund may be considered under the following conditions only:"}</p>
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-2">
                                            <p className="font-bold text-emerald-900">{"Condition 1: Non-Delivery of Services"}</p>
                                            <p className="text-emerald-800 mt-1">{"If Auction11 is unable to deliver the purchased service within the timeframe specified in the Auction11 application, you will be eligible for a full refund of the amount paid."}</p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2">
                                            <p className="font-bold text-blue-900">{"Condition 2: Genuine Dispute"}</p>
                                            <p className="text-blue-800 mt-1">{"If you have a genuine, verifiable reason for requesting a refund that does not fall within Condition 1, you may submit a refund request to our support team at auction11.live@gmail.com. Our team will conduct a thorough review of the circumstances and provide a final decision within a reasonable timeframe."}</p>
                                        </div>
                                        <p className="mt-2">{"Auction11 reserves the right to approve or decline refund requests based on the outcome of its investigation. All decisions made by Auction11 in this regard shall be considered final."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">4. How to Request a Refund</h4>
                                        <ol className="list-decimal pl-5 space-y-2 mt-1">
                                            <li>{"Send an email to auction11.live@gmail.com with the subject line: \"Refund Request – [Your Order ID]\"."}</li>
                                            <li>{"Include your registered name, email address, order details, and a clear explanation of your reason for requesting a refund."}</li>
                                            <li>{"Our support team will acknowledge your request within 2–3 business days and communicate the outcome to you."}</li>
                                        </ol>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">5. Refund Processing</h4>
                                        <p>{"Approved refunds will be processed to the original payment method used at the time of purchase. Processing time may vary depending on your bank or payment provider, but typically takes 5–10 business days from the date of approval."}</p>
                                        <p>{"Auction11 does not bear responsibility for any delays caused by third-party payment processors or financial institutions."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">6. Non-Refundable Circumstances</h4>
                                        <p>{"Refunds will not be issued in the following situations:"}</p>
                                        <ul className="list-disc pl-5 space-y-2 mt-1">
                                            <li>{"The service was delivered as described and within the specified timeframe."}</li>
                                            <li>{"You changed your mind after the Order was placed and services commenced."}</li>
                                            <li>{"The refund request is based on subjective preferences unrelated to service quality or delivery."}</li>
                                            <li>{"The request is made after the service has been fully consumed or the auction event has concluded."}</li>
                                        </ul>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">7. Modifications to This Policy</h4>
                                        <p>{"Auction11 reserves the right to revise this Cancellation & Refund Policy at any time. Any changes will be posted on our website, and where significant, we will notify you by email. Your continued use of the Services following such changes constitutes your acceptance of the revised policy."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">8. Contact Us</h4>
                                        <p>{"For any questions or concerns related to cancellations, refunds, or this policy, please reach out to us:"}</p>
                                        <p className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-2">
                                            <strong>{"Auction11"}</strong><br />
                                            {"Email: auction11.live@gmail.com"}<br />
                                            {"Website: https://www.auction11.live"}<br />
                                            {"Location: Karnataka, India"}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-gray-800">
                                            {"Auction11 is a fully digital platform that delivers online cricket auction services. We do not manufacture, stock, or ship any physical products. This Shipping & Delivery Policy outlines how we fulfil service orders, manage digital delivery, and address related queries. By placing an order on our platform, you acknowledge and agree to the terms described in this policy."}
                                        </p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">1. Nature of Services</h4>
                                        <p>{"All products and services offered by Auction11 are digital in nature. Upon successful purchase, you will receive access to the relevant features or service packages within the Auction11 application. No physical delivery is required or applicable."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">2. Order Confirmation and Fulfilment</h4>
                                        <p>{"Upon completing a purchase, you will receive:"}</p>
                                        <ul className="list-disc pl-5 space-y-2 mt-1">
                                            <li>{"A confirmation email containing your order details, selected service package, and access instructions."}</li>
                                            <li>{"Access to your purchased auction service through the Auction11 application, based on the package chosen."}</li>
                                            <li>{"The ability to track the progress of your auction in real-time directly through the platform."}</li>
                                        </ul>
                                        <p className="mt-2">{"If you do not receive a confirmation email within a reasonable time after placing your order, please check your spam or junk folder, or contact our support team at auction11.live@gmail.com."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">3. Digital Access and Delivery</h4>
                                        <p>{"Access to purchased services is typically granted immediately or within a short period following confirmation of your payment. The specific service features available to you will depend on your chosen service package. In the event of technical issues or delays in service activation, our team will work diligently to resolve the matter and ensure prompt access."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">4. Service Cancellations by Auction11</h4>
                                        <p>{"We reserve the right to cancel your order if we are unable to provide the requested service due to technical limitations, platform incompatibility, or other operational constraints. In such cases, you will be entitled to a full refund of any amount paid. We will notify you promptly via email in the event that your order is cancelled by us, along with the reason for cancellation and refund timelines."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">5. Refunds</h4>
                                        <p>{"For details regarding refund eligibility and the process for requesting a refund, please refer to our Cancellation & Refund Policy, available on our website. Refund decisions are subject to the conditions outlined therein."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">6. Changes to This Policy</h4>
                                        <p>{"Auction11 reserves the right to update or modify this Shipping & Delivery Policy at any time. In the event of significant changes, we will notify you via email and update this page accordingly. Your continued use of the Services following such changes indicates your acceptance of the revised policy."}</p>

                                        <h4 className="font-bold text-gray-950 text-base mt-6">7. Contact Us</h4>
                                        <p>{"If you have any questions regarding your order, service delivery, or this policy, please get in touch with us:"}</p>
                                        <p className="bg-gray-50 border border-gray-100 rounded-xl p-4 mt-2">
                                            <strong>{"Auction11"}</strong><br />
                                            {"Email: auction11.live@gmail.com"}<br />
                                            {"Website: https://www.auction11.live"}<br />
                                            {"Location: Karnataka, India"}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                                <button
                                    onClick={() => setActivePolicy(null)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    {"Close"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}