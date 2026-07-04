"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../../../store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { boosterSchema, bidIncrementSchema, formatZodErrors } from "../../../../../lib/validations";
import { useAuctionDetails } from "../../../../../hooks/useManageAuction";
import { useAuctions } from "../../../../../hooks/useAuctions";
import { SearchableSelect } from "../../../../../components/ui/SearchableSelect";
import {
    Users,
    Network,
    LayoutList,
    Pencil,
    Trash2,
    Copy,
    Calendar,
    Clock,
    MonitorDot,
    Globe,
    CreditCard,
    IndianRupee,
    BadgeDollarSign,
    UserCheck,
    Activity,
    Import,
    TrendingUp,
    AlertCircle,
    Loader2
} from "lucide-react";

export default function AuctionDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const auctionId = params.auctionId as string;

    const { data: auction, isLoading } = useAuctionDetails(auctionId);
    const { data: allAuctions } = useAuctions();
    const queryClient = useQueryClient();
    const { firebaseToken, user } = useAuthStore();

    const plan = auction?.planTier || "FREE";
    const hasPaidPlan = plan.toLowerCase() !== "free" || auction?.isPaid === true;

    // UI states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [importSourceId, setImportSourceId] = useState("");
    const [isImporting, setIsImporting] = useState(false);

    // Booster form state
    const [boosterForm, setBoosterForm] = useState({ boosterName: "", afterValue: "" });
    const [boosterErrors, setBoosterErrors] = useState<Record<string, string>>({});
    const [isSavingBooster, setIsSavingBooster] = useState(false);

    // Bid Increment form state
    const [incrementForm, setIncrementForm] = useState({ incrementValue: "", afterPoints: "" });
    const [incrementErrors, setIncrementErrors] = useState<Record<string, string>>({});
    const [increments, setIncrements] = useState<Array<{ increment: number, threshold: number }>>([]);
    const [isSavingIncrement, setIsSavingIncrement] = useState(false);

    // Abort controller for import
    const importAbortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (auction) {
            if (auction.isBoosterEnabled && typeof auction.boosterAmount === 'number') {
                setBoosterForm({
                    boosterName: (auction.boosterAmount || "").toString(),
                    afterValue: (auction.boosterTriggerPlayerCount || "").toString(),
                });
            }
            if (auction.bidRules && Array.isArray(auction.bidRules) && auction.bidRules.length > 0) {
                setIncrements(auction.bidRules);
            }
        }
    }, [auction]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard!");
    };

    const handleDeleteAuction = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/${auctionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });
            if (!res.ok) throw new Error("Failed to delete auction");
            toast.success("The auction has been permanently deleted.");
            queryClient.invalidateQueries({ queryKey: ["auctions"] });
            router.replace("/dashboard/my-auction");
        } catch (error) {
            toast.error("Something went wrong while deleting the auction.");
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleBoosterAdd = async () => {
        const result = boosterSchema.safeParse(boosterForm);
        if (!result.success) {
            setBoosterErrors(formatZodErrors(result.error));
            toast.error(result.error.issues[0]?.message || "Invalid booster settings");
            return;
        }
        setBoosterErrors({});
        setIsSavingBooster(true);

        try {
            const payload = {
                isBoosterEnabled: true,
                boosterAmount: Number(boosterForm.boosterName),
                boosterTriggerPlayerCount: Number(boosterForm.afterValue)
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/${auctionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${firebaseToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save booster settings");
            toast.success(`Booster activated! Teams will now get an extra ₹${Number(payload.boosterAmount || 0).toLocaleString('en-IN')} after ${payload.boosterTriggerPlayerCount} players.`);
            queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        } catch (error) {
            toast.error("We couldn't save the booster settings.");
        } finally {
            setIsSavingBooster(false);
        }
    };

    const handleBoosterDelete = async () => {
        setIsSavingBooster(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/${auctionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseToken}` },
                body: JSON.stringify({ isBoosterEnabled: false, boosterAmount: null, boosterTriggerPlayerCount: null })
            });
            if (!res.ok) throw new Error("Failed to remove booster");
            toast.success("The booster has been removed.");
            queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        } catch (error) { toast.error("We couldn't remove the booster. Please try again."); } finally { setIsSavingBooster(false); }
    };

    const handleIncrementAdd = async () => {
        const result = bidIncrementSchema.safeParse(incrementForm);
        if (!result.success) {
            setIncrementErrors(formatZodErrors(result.error));
            toast.error(result.error.issues[0]?.message || "Invalid increment rule");
            return;
        }
        setIncrementErrors({});
        setIsSavingIncrement(true);

        const newRules = [
            ...increments,
            { increment: Number(incrementForm.incrementValue), threshold: Number(incrementForm.afterPoints) }
        ];

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/${auctionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${firebaseToken}`
                },
                body: JSON.stringify({ bidRules: newRules })
            });

            if (!res.ok) throw new Error("Failed to save bid rules");
            toast.success("The new bid increment rule is now active!");
            setIncrements(newRules);
            setIncrementForm({ incrementValue: "", afterPoints: "" });
            queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        } catch (error) {
            toast.error("We couldn't save the bid rules. Please try again.");
        } finally {
            setIsSavingIncrement(false);
        }
    };

    const handleIncrementDelete = async (idxToDelete: number) => {
        setIsSavingIncrement(true);
        const newRules = increments.filter((_, i) => i !== idxToDelete);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auction/${auctionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${firebaseToken}`
                },
                body: JSON.stringify({ bidRules: newRules })
            });

            if (!res.ok) throw new Error("Failed to update bid rules");
            toast.success("The rule has been removed.");
            setIncrements(newRules);
            queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        } catch (error) {
            toast.error("We couldn't remove the rule. Please try again.");
        } finally {
            setIsSavingIncrement(false);
        }
    };

    const handleTeamImport = async () => {
        if (!importSourceId) {
            toast.error("Please select a source auction.");
            return;
        }
        // Cancel any ongoing import
        if (importAbortRef.current) {
            importAbortRef.current.abort();
        }
        const controller = new AbortController();
        importAbortRef.current = controller;
        setIsImporting(true);

        // Timeout after 30 seconds
        const timeoutId = setTimeout(() => {
            controller.abort();
            toast.error("Import took too long. Please try again later.");
            setIsImporting(false);
        }, 30000);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/team/import`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${firebaseToken}`
                },
                body: JSON.stringify({ currentAuctionId: auctionId, sourceAuctionId: importSourceId }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to import teams");

            const importInfo = resData.data;
            if (importInfo && importInfo.skippedCount > 0) {
                toast.success(`Imported ${importInfo.importedCount} teams. ${importInfo.skippedCount} skipped due to plan limit (${importInfo.limit} teams max).`);
            } else {
                toast.success("Teams have been imported successfully!");
            }
            queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
            router.push(`/dashboard/manage/${auctionId}/teams`);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // Already handled by timeout
            } else {
                toast.error(error.message || "We couldn't import the teams. Please check the source auction.");
            }
        } finally {
            clearTimeout(timeoutId);
            setIsImporting(false);
            importAbortRef.current = null;
        }
    };

    // Filter auctions that have at least 1 team (to avoid empty imports)
    const eligibleAuctions = (allAuctions || []).filter((a: any) => a.id !== auctionId && (a._count?.teams || 0) > 0);

    // Animation variants
    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } } };

    // Improved skeleton loader
    if (isLoading || !auction) {
        return (
            <div className="w-full min-h-full flex flex-col pb-20 font-poppins animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-48 bg-gray-300/60 rounded mb-6" />
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-[70px] h-[70px] rounded-full bg-gray-200" />
                            <div className="space-y-2">
                                <div className="h-5 w-52 bg-gray-300/60 rounded" />
                                <div className="h-3 w-28 bg-gray-200 rounded" />
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-end">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                                    <div className="h-2 w-10 bg-gray-100 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                            <div className="h-6 w-24 bg-gray-300/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20 font-poppins">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/my-auction" className="hover:text-[#012972]">My Auction</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">Details</span>
            </div>

            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 drop-shadow-sm uppercase tracking-tight">AUCTION DETAIL</h1>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-[1400px]">

                {/* Header Navigation Panel */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
                    <Link href={`/auctions/panel?id=${auction.id}`} className="text-[#0C3278] font-bold text-[15px] flex items-center gap-1.5 hover:underline w-fit">
                        Go to Auction Panel <MonitorDot size={18} strokeWidth={2.5} />
                    </Link>

                    <div className="flex flex-col lg:flex-row justify-between gap-5 mt-2">
                        {/* Left: Logo & Info */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                            <div className="w-[70px] h-[70px] rounded-full border-2 border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                {auction.logo ? <img src={auction.logo} alt="Logo" width={70} height={70} className="object-cover" /> : <span className="text-2xl">🏆</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl sm:text-[22px] font-extrabold text-gray-900 leading-none">{auction.name}</h2>
                                    {hasPaidPlan ? (
                                        <div className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase select-none">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                                        </div>
                                    ) : (
                                        <button className="bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase hover:bg-red-100 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Deactivate
                                        </button>
                                    )}
                                </div>
                                <p className="text-[12px] font-bold text-gray-500 font-epilogue tracking-wide">Code: {auction.auctionCode}</p>
                                <div className="flex flex-wrap items-center gap-4 text-[12px] text-gray-500 font-semibold font-epilogue mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(auction.auctionDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {auction.auctionStartTime}</div>
                                    <div className="flex items-center gap-1.5"><Activity size={14} className="text-gray-400" /> Status: <span className={`font-bold ${auction.status === 'LIVE' ? 'text-green-600' : 'text-amber-600'}`}>{auction.status}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-5 border-t lg:border-t-0 pt-4 lg:pt-0">
                            {[
                                { icon: Users, label: "Team", href: `/dashboard/manage/${auction.id}/teams` },
                                { icon: LayoutList, label: "Category", href: `/dashboard/manage/${auction.id}/categories` },
                                { icon: Network, label: "Players", href: `/dashboard/manage/${auction.id}/players` },
                                { icon: CreditCard, label: "Payment", href: `/dashboard/manage/${auction.id}/payment`, color: "text-gray-400", hover: "group-hover:text-[#10B981]" },
                                { icon: Pencil, label: "Edit", href: `/dashboard/manage/${auction.id}/edit` },
                                { icon: Trash2, label: "Delete", color: "text-red-500", hover: "hover:text-red-600", onClick: () => setIsDeleteModalOpen(true) },
                            ].map((item, i) => (
                                item.href ? (
                                    <Link key={i} href={item.href} className="flex flex-col items-center justify-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
                                        <item.icon size={20} className={`${item.color || "text-gray-400"} ${item.hover || "group-hover:text-[#0C3278]"} transition-colors`} strokeWidth={2} />
                                        <span className={`text-[10px] sm:text-[11px] font-semibold ${item.color || "text-gray-500"} ${item.hover || "group-hover:text-[#0C3278]"}`}>{item.label}</span>
                                    </Link>
                                ) : (
                                    <button key={i} onClick={item.onClick} className="flex flex-col items-center justify-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
                                        <item.icon size={20} className={`${item.color || "text-gray-400"} ${item.hover || "group-hover:text-[#0C3278]"} transition-colors`} strokeWidth={2} />
                                        <span className={`text-[10px] sm:text-[11px] font-semibold ${item.color || "text-gray-500"} ${item.hover || "group-hover:text-[#0C3278]"}`}>{item.label}</span>
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats Grid - fixed playersPerTeam to show min-max range */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: IndianRupee, label: "Budget / Team", value: `₹${Number(auction.budgetPerTeam || 0).toLocaleString('en-IN')}`, color: "#0C3278" },
                        { icon: BadgeDollarSign, label: "Min Bid", value: `₹${Number(auction.minBid || 0).toLocaleString('en-IN')}`, color: "#059669" },
                        { icon: TrendingUp, label: "Bid Increment", value: `₹${Number(auction.bidIncrease || 0).toLocaleString('en-IN')}`, color: "#D97706" },
                        { icon: UserCheck, label: "Players / Team", value: `${auction.minPlayersPerTeam}–${auction.maxPlayersPerTeam} `, color: "#7C3AED" },
                    ].map((stat, i) => {
                        const StatIcon = stat.icon;
                        return (
                            <motion.div whileHover={{ y: -3 }} key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col gap-2 hover:shadow-md transition-all">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                                        <StatIcon size={16} style={{ color: stat.color }} />
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase">{stat.label}</span>
                                </div>
                                <span className="text-xl sm:text-[22px] font-semibold text-gray-700">{stat.value}</span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Auction Links + Activity Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <motion.div variants={itemVariants} className="bg-[#F8FAFC] rounded-2xl border border-gray-200 shadow-inner p-5 sm:p-6 flex flex-col gap-5">
                        <h3 className="text-[#0C3278] font-bold text-[15px]">Go to Auction Panel</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-[13px] font-bold text-[#0C3278] flex items-center gap-1.5 mb-1"><Globe size={14} /> Public View</span>
                                <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-[#0C3278] transition-colors" onClick={() => handleCopy(`https://auction.com/view/${auction.id}`)}>
                                    <p className="text-[11px] text-gray-500 truncate w-[90%] font-epilogue">https://auction.com/view/{auction.id}</p>
                                    <Copy size={14} className="text-gray-400 hover:text-[#0C3278]" />
                                </div>
                            </div>
                            <div>
                                <span className="text-[13px] font-bold text-[#0C3278] flex items-center gap-1.5 mb-1"><MonitorDot size={14} /> Overlay Links</span>
                                <div className="flex flex-col gap-2">
                                    <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-[#0C3278] transition-colors" onClick={() => handleCopy(`https://auction.com/manage/ov?id=${auction.id}`)}>
                                        <p className="text-[11px] text-gray-500 truncate w-[90%] font-epilogue">https://auction.com/manage/ov?id={auction.id}</p>
                                        <Copy size={14} className="text-gray-400" />
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:border-[#0C3278] transition-colors" onClick={() => handleCopy(`https://auction.com/manage/ov?id=${auction.id}&tm=2`)}>
                                        <p className="text-[11px] text-gray-500 truncate w-[90%] font-epilogue">https://auction.com/manage/ov?id={auction.id}&tm=2</p>
                                        <Copy size={14} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                        <h3 className="text-[#0C3278] font-bold text-[15px] flex items-center gap-2"><Activity size={16} /> Activity Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#F0F4FF] rounded-xl p-4 flex flex-col gap-1 text-center">
                                <span className="text-[28px] font-extrabold text-[#0C3278]">{auction._count?.teams || auction.teams?.length || 0}</span>
                                <span className="text-[11px] font-bold text-gray-500 uppercase">Teams</span>
                            </div>
                            <div className="bg-[#F0FDF4] rounded-xl p-4 flex flex-col gap-1 text-center">
                                <span className="text-[28px] font-extrabold text-[#059669]">{auction._count?.players || auction.players?.length || 0}</span>
                                <span className="text-[11px] font-bold text-gray-500 uppercase">Players</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <span className="text-sm font-semibold text-gray-600">Status</span>
                            <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${auction.status === 'UPCOMING' ? 'bg-amber-100 text-amber-700' : auction.status === 'LIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {auction.status}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Booster & Bid Increment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* Booster Setting */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col">
                        <h3 className="text-[#0C3278] font-bold text-[13px] border-b border-[#0C3278]/20 pb-2 mb-6 w-full text-center">Booster Setting</h3>
                        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4 w-full items-end justify-center">
                                <div className="w-full sm:w-[45%]">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Booster Amount (₹)</label>
                                    <input type="number" placeholder="e.g. 5000" value={boosterForm.boosterName} onChange={(e) => setBoosterForm({ ...boosterForm, boosterName: e.target.value })} className={`border rounded-lg p-2 text-sm outline-none w-full ${boosterErrors.boosterName ? 'border-red-400' : 'border-gray-300'}`} />
                                    {boosterErrors.boosterName && <span className="text-[10px] text-red-500">{boosterErrors.boosterName}</span>}
                                </div>
                                <div className="w-full sm:w-[45%]">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">After (# Players)</label>
                                    <input type="number" placeholder="e.g. 10" value={boosterForm.afterValue} onChange={(e) => setBoosterForm({ ...boosterForm, afterValue: e.target.value })} className={`border rounded-lg p-2 text-sm outline-none w-full ${boosterErrors.afterValue ? 'border-red-400' : 'border-gray-300'}`} />
                                    {boosterErrors.afterValue && <span className="text-[10px] text-red-500">{boosterErrors.afterValue}</span>}
                                </div>
                                <button onClick={handleBoosterAdd} disabled={isSavingBooster} className="bg-[#0C3278] text-white text-[12px] font-bold px-5 py-2 rounded-lg hover:bg-[#082254] transition-colors shadow-md h-fit shrink-0 disabled:opacity-50">
                                    {isSavingBooster ? "Saving..." : "Save"}
                                </button>
                            </div>

                            {auction?.isBoosterEnabled && (
                                <div className="flex items-center justify-center flex-wrap gap-3 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3 w-fit mx-auto shadow-sm mt-2">
                                    <span>Booster <span className="text-[#0C3278] font-bold">₹{Number(auction.boosterAmount || 0).toLocaleString('en-IN')}</span></span>
                                    <span>after <span className="text-[#0C3278] font-bold">{auction.boosterTriggerPlayerCount}</span> players</span>
                                    <Trash2 size={13} className="text-red-500 ml-2 hover:text-red-600 cursor-pointer" onClick={handleBoosterDelete} />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Bid Increment */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col">
                        <h3 className="text-[#0C3278] font-bold text-[13px] border-b border-[#0C3278]/20 pb-2 mb-6 w-full text-center">Bid Increment Rules</h3>
                        <div className="flex flex-col sm:flex-row gap-4 w-full items-end justify-center max-w-md mx-auto mb-6">
                            <div className="w-full sm:w-1/3">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Increment (₹)</label>
                                <input type="number" placeholder="Increment" value={incrementForm.incrementValue} onChange={(e) => setIncrementForm({ ...incrementForm, incrementValue: e.target.value })} className={`border rounded-lg p-2 text-sm outline-none w-full ${incrementErrors.incrementValue ? 'border-red-400' : 'border-gray-300'}`} />
                                {incrementErrors.incrementValue && <span className="text-[10px] text-red-500">{incrementErrors.incrementValue}</span>}
                            </div>
                            <div className="w-full sm:w-1/3">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Threshold (₹)</label>
                                <input type="number" placeholder="After" value={incrementForm.afterPoints} onChange={(e) => setIncrementForm({ ...incrementForm, afterPoints: e.target.value })} className={`border rounded-lg p-2 text-sm outline-none w-full ${incrementErrors.afterPoints ? 'border-red-400' : 'border-gray-300'}`} />
                                {incrementErrors.afterPoints && <span className="text-[10px] text-red-500">{incrementErrors.afterPoints}</span>}
                            </div>
                            <button onClick={handleIncrementAdd} disabled={isSavingIncrement} className="bg-[#0C3278] text-white text-[12px] font-bold px-6 py-2 rounded-lg hover:bg-[#082254] transition-colors shadow-md shrink-0 disabled:opacity-50">
                                {isSavingIncrement ? "..." : "Add"}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {increments.map((inc, idx) => (
                                <div key={idx} className="flex items-center justify-between flex-wrap gap-3 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3 shadow-sm mx-auto max-w-md">
                                    <span>Increment <span className="text-[#0C3278] font-bold">₹{Number(inc.increment || 0).toLocaleString('en-IN')}</span></span>
                                    <span>when bid reaches <span className="text-[#0C3278] font-bold">₹{Number(inc.threshold || 0).toLocaleString('en-IN')}</span></span>
                                    <Trash2 size={13} className="text-red-500 hover:text-red-600 cursor-pointer" onClick={() => handleIncrementDelete(idx)} />
                                </div>
                            ))}
                            {increments.length === 0 && (
                                <p className="text-center text-xs text-gray-400">No custom rules. Default increment of ₹{Number(auction.bidIncrease || 0).toLocaleString('en-IN')} applies.</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Import Teams & Theme Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* Theme Settings */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#DFE4F8] to-[#F1E5F8] border border-[#d6c4e0] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at right top, #9D4EDD, transparent 50%)" }}></div>
                        <p className="text-[13px] sm:text-[14px] font-semibold text-[#3D2C59] text-center sm:text-left relative z-10">
                            Customize your Auction Theme <br className="hidden sm:block" />
                            <span className="opacity-80 text-xs">(Background, Stamps, Sold Effects)</span>
                        </p>
                        <Link href={`/dashboard/manage/${auction.id}/customize`}
                            className="bg-[#783EC5] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#5D2C9D] transition-colors shadow-[0_4px_14px_rgba(120,62,197,0.3)] relative z-10 whitespace-nowrap">
                            Customize
                        </Link>
                    </motion.div>

                    {/* Import Teams Panel */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                        <div>
                            <h3 className="text-[#0C3278] font-bold text-[15px] mb-2 flex items-center gap-2"><Import size={16} /> Import Teams</h3>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                Clone complete team profiles from your previous auctions. <br />
                                <span className="text-amber-600 font-bold">Note:</span> Budget will be reset to this auction's base budget.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <SearchableSelect
                                    options={eligibleAuctions.map((a: any) => ({
                                        label: `${a.name} (${a._count?.teams || 0} Teams)`,
                                        value: a.id
                                    }))}
                                    value={importSourceId}
                                    onChange={setImportSourceId}
                                    placeholder="Select auction with teams"
                                />
                                {eligibleAuctions.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> No other auctions with teams found.</p>
                                )}
                            </div>
                            <button
                                onClick={handleTeamImport}
                                disabled={!importSourceId || isImporting || eligibleAuctions.length === 0}
                                className="bg-[#0C3278] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg hover:bg-[#0a214e] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
                            >
                                {isImporting ? (
                                    <span className="flex items-center gap-2">
                                        Importing...
                                        <Loader2 size={16} className="animate-spin text-white" />
                                    </span>
                                ) : (
                                    "Import Teams"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Auction?</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Are you absolutely sure you want to permanently delete <strong className="text-gray-800">{auction?.name}</strong>? This action cannot be undone. All teams, players, and transaction logs will be destroyed.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAuction}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete Everything"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}