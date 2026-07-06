"use client";

import { useAuctions } from "../../../../hooks/useAuctions";
import { AuctionCardSkeleton } from "../../../../components/ui/AuctionCardSkeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, Copy, ExternalLink, MonitorDot, Calendar, Clock, TerminalSquare } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function AuctionsPanelPage() {
    const { data: auctions = [], isLoading } = useAuctions();

    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium mb-4 w-fit bg-white/40 px-3 py-1 rounded-full backdrop-blur-sm">
                <Link href="/dashboard/organizer" className="hover:text-gray-700">Dashboard</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">Live Auctions Panel</span>
            </div>

            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-[32px] font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
                    <MonitorDot className="text-[#FFBA00]" size={36} strokeWidth={2.5} />
                    Live Broadcasting Hub
                </h1>
                <p className="text-[#4a6090] font-medium max-w-2xl">
                    Manage all your live auction sessions. Access your secure organizer dashboards and generate streaming overlays and public Viewer URLs from here.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <AuctionCardSkeleton key={idx} layout="vertical" />
                    ))}
                </div>
            ) : auctions.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-gray-100 shadow-sm gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2"><TerminalSquare className="text-gray-300" size={32} /></div>
                    <p className="text-gray-500 font-semibold text-lg text-center">No auctions available for broadcasting.</p>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {auctions.map((auction: any) => (
                        <motion.div
                            variants={itemVariants}
                            key={auction.id}
                            className="bg-white rounded-2xl flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e0e7f5] overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="bg-[#0C3278] p-5 text-white relative overflow-hidden">
                                <div className="absolute right-[-10%] top-[-30%] opacity-10 pointer-events-none">
                                    <MonitorDot size={150} />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden border-2 border-white/10 bg-white">
                                            {auction.logo ? (
                                                <img src={auction.logo} alt="Logo" width={50} height={50} className="object-cover" />
                                            ) : (
                                                <img src="/icon1.png" alt="Logo" width={50} height={50} className="object-cover" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-[16px] font-black leading-tight line-clamp-1 truncate pr-4">{auction.name}</h2>
                                            <div className="text-[10px] font-bold text-[#FFBA00] uppercase tracking-widest font-mono mt-0.5">CODE: {auction.auctionCode}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <div className="bg-white/10 px-2.5 py-1 rounded flex items-center gap-1.5"><Calendar size={12} className="text-[#FFBA00]" /> <span className="text-[11px] font-semibold">{new Date(auction.auctionDate).toLocaleDateString()}</span></div>
                                    <div className="bg-white/10 px-2.5 py-1 rounded flex items-center gap-1.5"><Clock size={12} className="text-[#FFBA00]" /> <span className="text-[11px] font-semibold uppercase">{auction.auctionStartTime || "TBD"}</span></div>
                                    <div className={`px-2.5 py-1 rounded flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${auction.status === 'UPCOMING' ? 'bg-[#FFBA00] text-[#012972]' : 'bg-white/10 text-white/80'}`}>{auction.status}</div>
                                </div>
                            </div>

                            {/* Actions / Links */}
                            <div className="p-5 flex flex-col gap-4 bg-[#f8fafc] grow">

                                {/* Organizer Dashboard Link */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-black text-[#012972] tracking-wider uppercase ml-1">Live Control Room</label>
                                    <Link href={`/live/${auction.id}`} target="_blank" className="w-full bg-[#00379d] hover:bg-[#012972] text-white px-4 py-3 rounded-xl font-bold flex items-center justify-between transition-all group shadow-sm">
                                        <div className="flex items-center gap-2"><PlayCircle size={16} /> <span className="text-sm">Secure Organizer Entry</span></div>
                                        <ExternalLink size={14} className="opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="w-full h-[1px] bg-gray-200/60 my-1" />

                                {/* Public Viewer Link */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-black text-gray-700 tracking-wider uppercase ml-1 flex justify-between">
                                        <span>Viewer Portal</span>
                                        <span className="text-[9px] text-gray-400 font-bold bg-white px-1.5 rounded border">PUBLIC</span>
                                    </label>
                                    <div className="flex gap-1.5 w-full">
                                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 overflow-hidden font-mono text-[11px] text-gray-500 whitespace-nowrap text-ellipsis flex items-center shadow-inner">
                                            {window.location.origin}/viewer/{auction.id}
                                        </div>
                                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/viewer/${auction.id}`); toast.success("Viewer Link Copied!") }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-bold transition-all border border-gray-200 shadow-sm flex items-center justify-center group">
                                            <Copy size={14} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                        <Link href={`/viewer/${auction.id}`} target="_blank" className="bg-blue-50 border text-blue-600 border-blue-200 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center group">
                                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>

                                {/* OBS Overlay Link */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-black text-gray-700 tracking-wider uppercase ml-1 flex justify-between">
                                        <span>Stream Overlay</span>
                                        <span className="text-[9px] text-gray-400 font-bold bg-white px-1.5 rounded border">OBS/VMIX</span>
                                    </label>
                                    <div className="flex gap-1.5 w-full">
                                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 overflow-hidden font-mono text-[11px] text-gray-500 whitespace-nowrap text-ellipsis flex items-center shadow-inner">
                                            {window.location.origin}/overlay/{auction.id}
                                        </div>
                                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/overlay/${auction.id}`); toast.success("Overlay URL Copied!") }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-bold transition-all border border-gray-200 shadow-sm flex items-center justify-center group">
                                            <Copy size={14} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                        <Link href={`/overlay/${auction.id}`} target="_blank" className="bg-[#FFBA00]/10 border text-[#b38200] border-[#FFBA00]/30 hover:bg-[#FFBA00]/20 px-3 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center group">
                                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
