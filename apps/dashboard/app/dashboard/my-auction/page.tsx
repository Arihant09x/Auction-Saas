"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Calendar,
    Clock,
    Users,
    Network,
    MonitorDot,
    Info,
    Pencil,
    Trash2,
    LayoutList,
    AlertTriangle,
    X,
    CreditCard,
    Copy,
    ExternalLink,
    PlayCircle
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "../../../store/auth.store";
import { AuctionCardSkeleton } from "../../../components/ui/AuctionCardSkeleton";
import { useAuctions } from "../../../hooks/useAuctions";
import { useQueryClient } from "@tanstack/react-query";

export default function MyAuctionPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const { data: realAuctions = [], isLoading } = useAuctions();

    const auctions = realAuctions || [];

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
    const [livePanelAuction, setLivePanelAuction] = useState<any>(null);

    // // Fetch and loading handled by useAuctions hook above

    // const handleDelete = async () => {
    //     if (!selectedAuctionId) return;

    //     try {
    //         const res = await fetch(`${apiUrl}/auction/${selectedAuctionId}`, {
    //             method: "DELETE",
    //             headers: { Authorization: `Bearer ${firebaseToken}` }
    //         });
    //         const resData = await res.json();

    //         if (!res.ok) throw new Error(resData.message || "Failed to delete auction");

    //         toast.success("The auction has been deleted. All associated data is removed.");
    //         queryClient.invalidateQueries({ queryKey: ['auctions'] });
    //     } catch (error: any) {
    //         toast.error("We couldn't delete the auction. Please try again.");
    //     } finally {
    //         setDeleteModalOpen(false);
    //         setSelectedAuctionId(null);
    //     }
    // };

    const openDeleteModal = (id: string) => { setSelectedAuctionId(id); setDeleteModalOpen(true); };

    // Staggered Animations
    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };
    const modalVariants: any = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } } };

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20">
            {/* Background Diagonal Swooshes (Cosmetic) */}
            <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
                <div className="sticky top-0 w-full h-screen overflow-hidden">
                    <div className="absolute" style={{ width: "140px", height: "200vh", background: "linear-gradient(80deg, #08245E, #0A307F)", transform: "rotate(18deg)", left: "70%", top: "-20%" }} />
                    <div className="absolute" style={{ width: "140px", height: "200vh", background: "#0A307F", transform: "rotate(18deg)", left: "63%", top: "-20%", filter: "drop-shadow(0 4px 20px #000)" }} />
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col w-full max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                    <Link href="/dashboard/organizer" className="hover:text-[#012972]">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#012972] font-semibold">My Auction</span>
                </div>

                {/* Header Row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                    <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 drop-shadow-sm">My Auction</h1>
                    <Link href="/dashboard/create-auction" className="w-full sm:w-auto">
                        <motion.button whileHover={{ scale: 1.05, cursor: "pointer" }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto bg-[#0C3278] border border-[#FFBA00] text-white px-6 py-2.5 rounded-[100px] text-[15px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#0C3278]/20">
                            <Plus size={18} strokeWidth={2.5} /> Create Auction
                        </motion.button>
                    </Link>
                </div>

                {/* Loading State or Data Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <AuctionCardSkeleton key={idx} layout="vertical" />
                        ))}
                    </div>
                ) : auctions.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-gray-100 shadow-sm gap-4">
                        <p className="text-gray-500 font-semibold text-lg">You have no auctions created yet.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {auctions.map((auction: any) => (
                            <motion.div variants={itemVariants} key={auction.id} className="bg-white rounded-2xl flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                                <div className="p-5 flex flex-col gap-4">
                                    {/* Top Metadata Row: ID and Plan Status */}
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] sm:text-[11px] font-bold text-gray-600 font-epilogue uppercase">Code: {auction.auctionCode}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 mt-1 rounded-md w-fit ${auction.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{auction.status}</span>
                                        </div>
                                        {/* Dynamic Tier Pillar */}
                                        <div className={`w-fit min-w-fit px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide uppercase ${auction.planTier === 'FREE' ? 'bg-gray-100 border-gray-200 text-gray-600' :
                                            auction.planTier === 'PREMIUM' ? 'bg-[#FFBA00]/20 border-[#FFBA00]/50 text-[#8B6500]' :
                                                'bg-[#0C3278]/10 border-[#0C3278]/30 text-[#0C3278]'
                                            }`}>
                                            {auction.planTier} PLAN
                                        </div>
                                    </div>

                                    {/* Profile Row */}
                                    <div className="flex gap-4 items-center">
                                        <div className="w-[65px] h-[65px] rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-gray-100 bg-gray-50">
                                            {auction.logo ? (
                                                <img src={auction.logo} alt="Logo" width={65} height={65} className="object-cover" />
                                            ) : (
                                                <img src="/icon1.png" alt="Logo" width={65} height={65} className="object-cover" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1.5 justify-center">
                                            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight line-clamp-2">{auction.name}</h3>
                                            <div className="flex flex-col gap-0.5 text-[11px] text-gray-600 font-semibold font-epilogue">
                                                <div className="flex items-center gap-1.5"><Calendar size={12} strokeWidth={2.5} className="text-gray-700" /> {new Date(auction.auctionDate).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-1.5"><Clock size={12} strokeWidth={2.5} className="text-gray-700 uppercase" /> {auction.auctionStartTime || "TBD"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-[1px] w-full bg-gray-100 mt-1" />

                                    {/* Stats Rows */}
                                    <div className="flex flex-col gap-2.5 text-[12px] font-bold text-gray-800">
                                        <div className="flex justify-between items-center w-[100%]">
                                            <div className="flex gap-1.5 items-center"><span className="text-gray-500 font-semibold">Players</span> {auction._count?.players || 0}</div>
                                            <div className="flex gap-1.5 items-center"><span className="text-gray-500 font-semibold">Teams</span> {auction._count?.teams || 0}</div>
                                        </div>
                                        <div className="flex justify-between items-center w-[100%]">
                                            <div className="flex gap-1.5 items-center"><span className="text-gray-500 font-semibold">Base Inc</span> ₹{auction.bidIncrease}</div>
                                            <div className="flex gap-1.5 items-center"><span className="text-gray-500 font-semibold">Min Bid</span> ₹{auction.minBid}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar Header with Labels */}
                                <div className="bg-[#0C3278] py-2 flex flex-row flex-nowrap justify-between items-center px-3 mt-auto border-t border-[#082254] overflow-x-auto no-scrollbar w-full">
                                    {/* Management Buttons */}
                                    <div className="flex flex-row flex-nowrap items-center gap-1.5 sm:gap-2.5 shrink-0">
                                        <Link href={`/dashboard/manage/${auction.id}/teams`} className="flex flex-col items-center justify-center text-white/80 hover:text-white cursor-pointer transition-all gap-0.5 group w-11 hover:-translate-y-0.5 shrink-0">
                                            <Users size={16} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Teams</span>
                                        </Link>
                                        <Link href={`/dashboard/manage/${auction.id}/categories`} className="flex flex-col items-center justify-center text-white/80 hover:text-white cursor-pointer transition-all gap-0.5 group w-11 hover:-translate-y-0.5 shrink-0">
                                            <LayoutList size={16} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Categs</span>
                                        </Link>
                                        <Link href={`/dashboard/manage/${auction.id}/players`} className="flex flex-col items-center justify-center text-white/80 hover:text-white cursor-pointer transition-all gap-0.5 group w-11 hover:-translate-y-0.5 shrink-0">
                                            <Network size={16} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Players</span>
                                        </Link>
                                        <button onClick={() => setLivePanelAuction(auction)} className="flex flex-col items-center justify-center text-white/80 hover:text-[#FFBA00] cursor-pointer transition-all gap-0.5 group w-11 hover:-translate-y-0.5 shrink-0">
                                            <MonitorDot size={16} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Live</span>
                                        </button>
                                        <Link href={`/dashboard/manage/${auction.id}/payment`} className="flex flex-col items-center justify-center text-white/80 hover:text-[#10B981] cursor-pointer transition-all gap-0.5 group w-11 hover:-translate-y-0.5 shrink-0">
                                            <CreditCard size={16} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Pay</span>
                                        </Link>
                                    </div>

                                    <div className="w-[1px] h-6 bg-white/10 mx-1.5 shrink-0"></div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-row flex-nowrap items-center gap-2 shrink-0">
                                        <Link href={`/dashboard/manage/${auction.id}/details`} className="flex flex-col items-center justify-center text-white/80 hover:text-white cursor-pointer transition-all gap-0.5 group w-[38px] hover:-translate-y-0.5 shrink-0">
                                            <Info size={16} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Info</span>
                                        </Link>
                                        <Link href={`/dashboard/manage/${auction.id}/edit`} className="flex flex-col items-center justify-center text-white/80 hover:text-white cursor-pointer transition-all gap-0.5 group w-[38px] hover:-translate-y-0.5 shrink-0">
                                            <Pencil size={15} strokeWidth={2.5} />
                                            <span className="text-[9px] font-semibold opacity-80 group-hover:opacity-100">Edit</span>
                                        </Link>
                                    </div>
                                </div>
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    .no-scrollbar::-webkit-scrollbar { display: none; }
                                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                                    `
                                }} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>




                {/* LIVE AUCTION PANEL MODAL */}
                {livePanelAuction && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div variants={modalVariants} initial="hidden" animate="show" exit="exit" className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col overflow-hidden relative">
                            {/* Close cross */}
                            <button onClick={() => setLivePanelAuction(null)} className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"><X size={20} strokeWidth={2.5} /></button>

                            {/* Header Panel */}
                            <div className="bg-[#0C3278] p-6 text-white pb-8 relative overflow-hidden">
                                <div className="absolute right-[-20%] top-[-50%] opacity-10">
                                    <MonitorDot size={240} />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse border border-white/20"><MonitorDot className="text-[#FFBA00]" size={24} strokeWidth={2.5} /></div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-black">{livePanelAuction.name}</h2>
                                        <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest font-mono">CODE: {livePanelAuction.auctionCode}</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2"><Calendar size={14} className="text-[#FFBA00]" /> <span className="text-sm font-semibold">{new Date(livePanelAuction.auctionDate).toLocaleDateString()}</span></div>
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2"><Clock size={14} className="text-[#FFBA00]" /> <span className="text-sm font-semibold uppercase">{livePanelAuction.auctionStartTime || "TBD"}</span></div>
                                </div>
                            </div>

                            {/* Actions / Links */}
                            <div className="p-6 bg-gray-50 flex flex-col gap-4">

                                {/* 1. Organizer Dashboard Link */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[12px] font-black text-[#012972] tracking-wider uppercase ml-1">Live Control Room</label>
                                    <p className="text-[12px] text-gray-500 font-semibold mb-2 ml-1">The secure organizer dashboard to control bids.</p>
                                    <Link href={`/live/${livePanelAuction.id}`} className="w-full bg-[#00379d] hover:bg-[#012972] text-white px-5 py-3.5 rounded-xl font-bold flex items-center justify-between transition-all group shadow-md shadow-[#00379d]/20">
                                        <div className="flex items-center gap-2"><PlayCircle size={18} /> <span>Enter Live Dashboard</span></div>
                                        <ExternalLink size={16} className="opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="w-full h-[1px] bg-gray-200 my-2" />

                                {/* 2. Public Viewer Link */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[12px] font-black text-gray-700 tracking-wider uppercase ml-1">Viewer Portal (Public)</label>
                                    <p className="text-[12px] text-gray-500 font-semibold mb-2 ml-1">For buyers and teams to watch and bid.</p>
                                    <div className="flex gap-2 w-full">
                                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1 overflow-hidden font-mono text-xs text-gray-500 whitespace-nowrap text-ellipsis flex items-center">
                                            {window.location.origin}/viewer/{livePanelAuction.id}
                                        </div>
                                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/viewer/${livePanelAuction.id}`); toast.success("Viewer portal link copied!") }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all border border-gray-200 shadow-sm flex items-center gap-2">
                                            <Copy size={16} /> <span className="hidden sm:block">Copy</span>
                                        </button>
                                        <Link href={`/viewer/${livePanelAuction.id}`} target="_blank" className="bg-white border text-blue-600 border-blue-200 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all shadow-sm flex items-center">
                                            <ExternalLink size={16} />
                                        </Link>
                                    </div>
                                </div>

                                {/* 3. OBS Overlay Link */}
                                <div className="flex flex-col gap-1 mt-2">
                                    <label className="text-[12px] font-black text-gray-700 tracking-wider uppercase ml-1">Live Stream Overlay</label>
                                    <p className="text-[12px] text-gray-500 font-semibold mb-2 ml-1">Browser source URL for OBS/vMix.</p>
                                    <div className="flex gap-2 w-full">
                                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1 overflow-hidden font-mono text-xs text-gray-500 whitespace-nowrap text-ellipsis flex items-center">
                                            {window.location.origin}/overlay/{livePanelAuction.id}
                                        </div>
                                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/overlay/${livePanelAuction.id}`); toast.success("Overlay URL copied! You can now paste it into OBS.") }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all border border-gray-200 shadow-sm flex items-center gap-2">
                                            <Copy size={16} /> <span className="hidden sm:block">Copy</span>
                                        </button>
                                        <Link href={`/overlay/${livePanelAuction.id}`} target="_blank" className="bg-white border text-blue-600 border-blue-200 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all shadow-sm flex items-center">
                                            <ExternalLink size={16} />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
