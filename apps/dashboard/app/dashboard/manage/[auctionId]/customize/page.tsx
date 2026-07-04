"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Palette, Image as ImageIcon, RotateCcw, ChevronRight,
    Check, Layers, Sparkles, ArrowLeft, Save, Lock
} from "lucide-react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useAuthStore } from "../../../../../store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useAuctionDetails } from "../../../../../hooks/useManageAuction";


// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveSettings {
    theme: string;
    soldEffect: string;
    soldEffectTrigger?: number;
}
interface OverlaySettings {
    theme: string;
    layout: string;
}

const DEFAULT_LIVE: LiveSettings = { theme: "logo-1", soldEffect: "confetti-center" };
const DEFAULT_OVERLAY: OverlaySettings = { theme: "default", layout: "player-card" };

// ─── Theme Presets ────────────────────────────────────────────────────────────
const LIVE_THEMES = [
    { key: "logo-1", label: "Preset 1", image: "/live-auction-photo/logo-1.png" },
    { key: "logo-2", label: "Preset 2", image: "/live-auction-photo/logo-2.png" },
    { key: "logo-3", label: "Preset 3", image: "/live-auction-photo/logo-3.png" },
    { key: "logo-4", label: "Preset 4", image: "/live-auction-photo/logo-4.png" },
];

const OVERLAY_THEMES = [
    { key: "default", label: "Overlay 1", image: "/overlay-photo/section-1.png", cardBg: "rgba(0,0,0,0.55)", border: "rgba(255,255,255,0.12)", accent: "#FFD500" },
    { key: "blue", label: "Overlay 2", image: "/overlay-photo/section-2.png", cardBg: "rgba(7,36,96,0.7)", border: "rgba(0,100,200,0.3)", accent: "#00f2c3" },
    { key: "gold", label: "Overlay 3", image: "/overlay-photo/section-3.png", cardBg: "rgba(20,10,0,0.7)", border: "rgba(255,213,0,0.4)", accent: "#FFD500" },
    { key: "minimal", label: "Overlay 4", image: "/overlay-photo/section-4.png", cardBg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.06)", accent: "#ffffff" },
];

const SOLD_EFFECTS = [
    { key: "confetti-center", label: "Center Burst", desc: "Classic confetti explosion from the center", color: "#F472B6" },
    { key: "confetti-cannons", label: "Side Cannons", desc: "Dual cannons firing from bottom corners", color: "#60A5FA" },
    { key: "confetti-fountain", label: "Fountain", desc: "Continuous fountain of confetti from bottom", color: "#34D399" },
    { key: "confetti-massive", label: "Massive Drop", desc: "Huge shower of confetti from the top", color: "#A78BFA" },
    { key: "flash", label: "Screen Flash", desc: "Screen-wide strobe flash effect", color: "#FFBA00" },
];

const OVERLAY_LAYOUTS = [
    { key: "player-card", label: "Player Card", desc: "Large card at bottom center with full info", emoji: "🃏" },
    { key: "bottom-bar", label: "Bottom Bar", desc: "Thin bar at very bottom of stream", emoji: "➖" },
    { key: "corner", label: "Corner Card", desc: "Compact card in bottom-left corner", emoji: "📐" },
    { key: "minimal", label: "Minimal", desc: "Player name + bid only — ultra clean", emoji: "✨" },
];


// ─── Large Preview Panel (right column) ──────────────────────────────────────
function ConfettiEffect({ effectKey }: { effectKey: string }) {
    useEffect(() => {
        if (effectKey === "confetti-center") {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, zIndex: 9999 });
        } else if (effectKey === "confetti-cannons") {
            confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, zIndex: 9999 });
            confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, zIndex: 9999 });
        } else if (effectKey === "confetti-fountain") {
            const end = Date.now() + 1.0 * 1000;
            const colors = ['#34D399', '#ffffff', '#FFD500'];
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors, zIndex: 9999 });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors, zIndex: 9999 });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        } else if (effectKey === "confetti-massive") {
            confetti({ particleCount: 300, spread: 120, startVelocity: 40, origin: { y: 0.1 }, zIndex: 9999 });
        }
    }, [effectKey]);
    return null;
}

function LivePreviewPanel({ liveSettings, liveActiveItem }: { liveSettings: LiveSettings, liveActiveItem: string }) {
    const foundTheme = LIVE_THEMES.find(t => t.key === liveSettings.theme);
    const foundEffect = SOLD_EFFECTS.find(e => e.key === liveSettings.soldEffect);
    const theme = (foundTheme ?? LIVE_THEMES[0])!;
    const effect = (foundEffect ?? SOLD_EFFECTS[0])!;

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden relative flex flex-col bg-black">
            <Image src={theme.image!} alt={theme.label} fill className="object-cover opacity-90" />

            {/* Simulated Sold Logo Animation - ONLY show when selecting sold effect */}
            {liveActiveItem === "sold-effect" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={effect.key + liveSettings.soldEffectTrigger}
                            initial={{ scale: 3, opacity: 0, z: 100 }}
                            animate={{ scale: 1, opacity: 1, z: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className={`relative w-48 h-48 drop-shadow-2xl ${effect.key === 'flash' ? 'drop-shadow-[0_0_40px_rgba(255,255,255,1)] animate-pulse' : ''}`}
                        >
                            <Image src="/sold-logo.png" alt="SOLD" fill className="object-contain" />
                        </motion.div>
                    </AnimatePresence>
                    {effect.key.startsWith("confetti") && <ConfettiEffect key={effect.key + liveSettings.soldEffectTrigger} effectKey={effect.key} />}
                </div>
            )}

            {/* Top header overlay context */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between z-10">
                <span className="text-white font-black text-[10px] uppercase tracking-tight">LIVE AUCTION PREVIEW</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white/60 text-[8px] font-bold">Connected</span>
                </div>
            </div>

            {/* Sold effect overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2 z-10">
                <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Sold Effect:</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-black/40 border border-white/20" style={{ color: effect.color }}>
                    {effect.label}
                </span>
            </div>
        </div>
    );
}

function OverlayPreviewPanel({ overlaySettings }: { overlaySettings: OverlaySettings }) {
    const foundTheme = OVERLAY_THEMES.find(t => t.key === overlaySettings.theme);
    const foundLayout = OVERLAY_LAYOUTS.find(l => l.key === overlaySettings.layout);
    const theme = (foundTheme ?? OVERLAY_THEMES[0])!;
    const layout = (foundLayout ?? OVERLAY_LAYOUTS[0])!;

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden relative bg-black flex flex-col">
            <Image src={theme.image!} alt={theme.label} fill className="object-cover" />

            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 p-2">
                <span className="text-white drop-shadow-md text-[10px] font-black uppercase">Stream Preview</span>
                <div className="flex gap-1.5 items-center px-2 py-1 bg-black/40 rounded-full backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-[9px] font-bold tracking-widest">LIVE</span>
                </div>
            </div>

            {layout.key === "player-card" && null}
            {layout.key === "bottom-bar" && (
                <div className="absolute bottom-0 left-0 right-0 z-10 border-t flex items-center gap-3 px-4 py-2"
                    style={{ background: theme.cardBg, borderColor: theme.border }}>
                    <div className="w-6 h-6 rounded-md bg-white/10" />
                    <span className="text-white font-black text-xs uppercase">Bhupendra Singh</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: theme.accent, color: "#000" }}>BOWLER</span>
                    <div className="ml-auto font-black text-sm" style={{ color: theme.accent }}>₹7L</div>
                    <span className="text-white/40 text-[9px]">RCB Leading</span>
                </div>
            )}
            {layout.key === "corner" && (
                <div className="absolute bottom-4 left-4 z-10 w-36 rounded-2xl border flex flex-col gap-2 p-3 backdrop-blur-xl"
                    style={{ background: theme.cardBg, borderColor: theme.border }}>
                    <div className="w-10 h-10 rounded-xl bg-white/10 mx-auto" />
                    <span className="text-white font-black text-[9px] uppercase text-center">Bhupendra Singh</span>
                    <span className="font-black text-xs text-center" style={{ color: theme.accent }}>₹7L</span>
                    <span className="text-white/40 text-[8px] text-center">RCB Leading</span>
                </div>
            )}
            {layout.key === "minimal" && (
                <div className="absolute bottom-5 inset-x-0 z-10 flex flex-col items-center gap-1">
                    <span className="text-white font-black text-sm uppercase italic tracking-tight drop-shadow-lg">Bhupendra Singh</span>
                    <span className="font-black text-2xl drop-shadow-lg" style={{ color: theme.accent }}>₹7L</span>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CustomizePage() {
    const params = useParams();
    const router = useRouter();
    const auctionId = params.auctionId as string;
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const queryClient = useQueryClient();

    const [tab, setTab] = useState<"live" | "overlay">("live");

    // live auction state
    const [liveSettings, setLiveSettings] = useState<LiveSettings>(DEFAULT_LIVE);
    const [liveActiveItem, setLiveActiveItem] = useState<"theme" | "sold-effect" | "default">("theme");

    // overlay state
    const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>(DEFAULT_OVERLAY);
    const [overlayActiveItem, setOverlayActiveItem] = useState<"theme" | "layout" | "default">("theme");

    const [isSaving, setIsSaving] = useState(false);

    const { data: auction, isLoading } = useAuctionDetails(auctionId);

    useEffect(() => {
        if (auction) {
            setLiveSettings(p => ({
                theme: auction.liveTheme || "logo-1",
                soldEffect: auction.soldEffect || "confetti-center",
                soldEffectTrigger: p.soldEffectTrigger || 0
            }));
            setOverlaySettings({
                theme: auction.overlayTheme || "default",
                layout: auction.overlayLayout || "player-card"
            });
        }
    }, [auction]);

    const handleSave = useCallback(async () => {
        if (!firebaseToken) {
            toast.error("You must be logged in to save customization.");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                liveTheme: liveSettings.theme,
                soldEffect: liveSettings.soldEffect,
                overlayTheme: overlaySettings.theme,
                overlayLayout: overlaySettings.layout,
            };

            const res = await fetch(`${apiUrl}/auction/${auctionId}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${firebaseToken}` 
                },
                body: JSON.stringify(payload)
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update customization.");

            toast.success("Customization saved!");
            queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        } catch (error: any) {
            toast.error(error.message || "Failed to save.");
        } finally {
            setIsSaving(false);
        }
    }, [auctionId, liveSettings, overlaySettings, firebaseToken, apiUrl, queryClient]);

    const handleReset = () => {
        if (tab === "live") {
            setLiveSettings(DEFAULT_LIVE);
            toast.info("Live Auction reset to defaults.");
        } else {
            setOverlaySettings(DEFAULT_OVERLAY);
            toast.info("Overlay reset to defaults.");
        }
    };

    // ── LIVE: left sidebar items ──
    const liveItems = [
        { key: "theme" as const, label: "Theme", icon: Palette },
        { key: "sold-effect" as const, label: "Sold Effect", icon: Sparkles },
        { key: "default" as const, label: "Default", icon: RotateCcw },
    ];
    // ── OVERLAY: left sidebar items ──
    const overlayItems = [
        { key: "theme" as const, label: "Theme", icon: Palette },
        { key: "layout" as const, label: "Layout", icon: Layers },
        { key: "default" as const, label: "Default", icon: RotateCcw },
    ];

    // ── Middle panel renderer (Live) ──
    function renderLiveMiddle() {
        if (liveActiveItem === "theme") {
            return (
                <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Choose Theme</p>
                    <div className="grid grid-cols-2 gap-3">
                        {LIVE_THEMES.map(t => {
                            const isLocked = t.key !== "logo-1";
                            return (
                                <button key={t.key}
                                    onClick={() => {
                                        if (isLocked) {
                                            toast("More presets coming soon!", { icon: "🔒" });
                                            return;
                                        }
                                        setLiveSettings(p => ({ ...p, theme: t.key }));
                                    }}
                                    className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-video ${liveSettings.theme === t.key ? "border-[#0C3278] shadow-md" : (isLocked ? "border-transparent opacity-50 cursor-not-allowed" : "border-transparent hover:border-gray-300")}`}>
                                    <div className="w-full h-full relative">
                                        <Image src={t.image!} alt={t.label} fill className="object-cover" />
                                    </div>
                                    {isLocked && (
                                        <div className="absolute top-1.5 left-1.5 p-1 bg-black/50 rounded-full shadow-sm backdrop-blur-sm">
                                            <Lock size={12} className="text-white/80" />
                                        </div>
                                    )}
                                    {liveSettings.theme === t.key && (
                                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0C3278] rounded-full flex items-center justify-center shadow">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-3 pb-1 text-center">
                                        <span className="text-white text-[10px] font-bold">{t.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        if (liveActiveItem === "sold-effect") {
            return (
                <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Sold Animation</p>
                    <div className="flex flex-col gap-2">
                        {SOLD_EFFECTS.map(effect => (
                            <button key={effect.key} onClick={() => setLiveSettings(p => ({ ...p, soldEffect: effect.key, soldEffectTrigger: (p.soldEffectTrigger || 0) + 1 }))}
                                className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${liveSettings.soldEffect === effect.key ? "border-[#0C3278] bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                                <span className="text-xl font-black w-12 text-center" style={{ color: effect.color }}>SOLD</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[13px] font-bold text-gray-800">{effect.label}</span>
                                    <span className="text-[10px] text-gray-400">{effect.desc}</span>
                                </div>
                                {liveSettings.soldEffect === effect.key && (
                                    <div className="ml-auto w-5 h-5 bg-[#0C3278] rounded-full flex items-center justify-center">
                                        <Check size={10} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        if (liveActiveItem === "default") {
            return (
                <div className="flex flex-col gap-4 items-center justify-center h-full py-8">
                    <RotateCcw size={36} className="text-gray-300" />
                    <p className="text-sm font-semibold text-gray-600 text-center">Reset Live Auction to<br />factory defaults?</p>
                    <button onClick={() => { setLiveSettings(DEFAULT_LIVE); toast.info("Live Auction reset."); }}
                        className="px-6 py-2.5 bg-red-50 border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors">
                        Reset to Default
                    </button>
                </div>
            );
        }
    }

    // ── Middle panel renderer (Overlay) ──
    function renderOverlayMiddle() {
        if (overlayActiveItem === "theme") {
            return (
                <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Choose Theme</p>
                    <div className="flex flex-col gap-2">
                        {OVERLAY_THEMES.map(t => {
                            const isLocked = t.key !== "default";
                            return (
                                <button key={t.key}
                                    onClick={() => {
                                        if (isLocked) {
                                            toast("More presets coming soon!", { icon: "🔒" });
                                            return;
                                        }
                                        setOverlaySettings(p => ({ ...p, theme: t.key }));
                                    }}
                                    className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${overlaySettings.theme === t.key ? "border-[#0C3278] bg-blue-50" : (isLocked ? "border-gray-100 opacity-50 cursor-not-allowed bg-gray-50/50" : "border-gray-200 hover:border-gray-300 bg-white")}`}>
                                    <div className="w-16 h-10 rounded-md overflow-hidden relative flex-shrink-0 bg-black">
                                        <Image src={t.image!} alt={t.label} fill className="object-cover opacity-90" />
                                    </div>
                                    <span className={`text-[13px] font-bold ${isLocked ? "text-gray-500" : "text-gray-800"}`}>{t.label}</span>
                                    {isLocked && (
                                        <div className="ml-auto">
                                            <Lock size={14} className="text-gray-400" />
                                        </div>
                                    )}
                                    {overlaySettings.theme === t.key && !isLocked && (
                                        <div className="ml-auto w-5 h-5 bg-[#0C3278] rounded-full flex items-center justify-center">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        if (overlayActiveItem === "layout") {
            return (
                <div className="flex flex-col gap-3">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Overlay Layout</p>
                    <div className="flex flex-col gap-2">
                        {OVERLAY_LAYOUTS.map(layout => {
                            const isLocked = layout.key !== "player-card";
                            return (
                                <button key={layout.key}
                                    onClick={() => {
                                        if (isLocked) {
                                            toast("More overlays coming soon!", { icon: "🔒" });
                                            return;
                                        }
                                        setOverlaySettings(p => ({ ...p, layout: layout.key }));
                                    }}
                                    className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${overlaySettings.layout === layout.key ? "border-[#0C3278] bg-blue-50" : (isLocked ? "border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed" : "border-gray-200 hover:border-gray-300 bg-white")}`}>
                                    <span className={`text-xl w-8 text-center flex-shrink-0 ${isLocked ? "grayscale opacity-60" : ""}`}>{layout.emoji}</span>
                                    <div className="flex flex-col gap-0.5">
                                        <span className={`text-[13px] font-bold ${isLocked ? "text-gray-500" : "text-gray-800"}`}>{layout.label}</span>
                                        <span className="text-[10px] text-gray-400">{layout.desc}</span>
                                    </div>
                                    {isLocked && (
                                        <div className="ml-auto flex-shrink-0">
                                            <Lock size={14} className="text-gray-400" />
                                        </div>
                                    )}
                                    {overlaySettings.layout === layout.key && !isLocked && (
                                        <div className="ml-auto w-5 h-5 bg-[#0C3278] rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        if (overlayActiveItem === "default") {
            return (
                <div className="flex flex-col gap-4 items-center justify-center h-full py-8">
                    <RotateCcw size={36} className="text-gray-300" />
                    <p className="text-sm font-semibold text-gray-600 text-center">Reset Overlay to<br />factory defaults?</p>
                    <button onClick={() => { setOverlaySettings(DEFAULT_OVERLAY); toast.info("Overlay reset."); }}
                        className="px-6 py-2.5 bg-red-50 border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors">
                        Reset to Default
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20 font-poppins">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/my-auction" className="hover:text-[#012972]">My Auction</Link>
                <span>/</span>
                <Link href={`/dashboard/manage/${auctionId}/details`} className="hover:text-[#012972]">Details</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">Customize Theme</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="ml-2 text-2xl sm:text-[28px] font-bold text-gray-900 uppercase tracking-tight">Auction Customization</h1>
                </div>
                <button onClick={handleSave} disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0C3278] text-white text-[13px] font-bold px-6 py-2.5 rounded-lg hover:bg-[#082254] transition-colors shadow-md disabled:opacity-50">
                    <Save size={14} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Tab Toggle */}
            <div className="flex items-center gap-1 mb-5 bg-white border border-gray-200 rounded-lg p-1 w-fit shadow-sm">
                {([{ key: "live", label: "Live Auction", icon: Layers }, { key: "overlay", label: "Overlay", icon: Sparkles }] as const).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold rounded-md transition-all ${tab === t.key ? "bg-[#0C3278] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                        <t.icon size={13} /> {t.label}
                    </button>
                ))}
            </div>

            {/* 3-Column Layout */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row" style={{ minHeight: "520px" }}>

                {/* ── Column 1: Sidebar items ── */}
                <div className="w-full lg:w-[130px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-row lg:flex-col p-2 lg:pt-3 lg:pb-3 gap-1 bg-gray-50/60 overflow-x-auto">
                    <AnimatePresence mode="wait">
                        {tab === "live" ? (
                            <motion.div key="live-items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-row lg:flex-col gap-1 px-1 lg:px-2 w-full">
                                {liveItems.map(item => (
                                    <button key={item.key} onClick={() => setLiveActiveItem(item.key)}
                                        className={`flex flex-col items-center gap-1.5 py-2 lg:py-3 px-2 rounded-xl transition-all text-center shrink-0 min-w-[90px] lg:min-w-0 ${liveActiveItem === item.key ? "bg-white border border-gray-200 shadow-sm text-[#0C3278]" : "text-gray-400 hover:text-gray-600 hover:bg-white/60"}`}>
                                        <item.icon size={18} strokeWidth={liveActiveItem === item.key ? 2.5 : 1.8} />
                                        <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="overlay-items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-row lg:flex-col gap-1 px-1 lg:px-2 w-full">
                                {overlayItems.map(item => (
                                    <button key={item.key} onClick={() => setOverlayActiveItem(item.key)}
                                        className={`flex flex-col items-center gap-1.5 py-2 lg:py-3 px-2 rounded-xl transition-all text-center shrink-0 min-w-[90px] lg:min-w-0 ${overlayActiveItem === item.key ? "bg-white border border-gray-200 shadow-sm text-[#0C3278]" : "text-gray-400 hover:text-gray-600 hover:bg-white/60"}`}>
                                        <item.icon size={18} strokeWidth={overlayActiveItem === item.key ? 2.5 : 1.8} />
                                        <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Column 2: Options panel ── */}
                <div className="w-full lg:w-[260px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-y-auto p-4">
                    <AnimatePresence mode="wait">
                        <motion.div key={`${tab}-${tab === "live" ? liveActiveItem : overlayActiveItem}`}
                            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.15 }}>
                            {tab === "live" ? renderLiveMiddle() : renderOverlayMiddle()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Column 3: Live Preview ── */}
                <div className="flex-1 p-4 lg:p-5 flex flex-col gap-3 bg-gray-50/40">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Preview</span>
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-inner" style={{ minHeight: "380px" }}>
                        <AnimatePresence mode="wait">
                            <motion.div key={`preview-${tab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full" style={{ minHeight: "380px" }}>
                                {tab === "live"
                                    ? <LivePreviewPanel liveSettings={liveSettings} liveActiveItem={liveActiveItem} />
                                    : <OverlayPreviewPanel overlaySettings={overlaySettings} />
                                }
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
                .font-poppins { font-family: 'Poppins', sans-serif; }
            `}</style>
        </div>
    );
}
