"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import confetti from "canvas-confetti";

// --- Types ---
interface PlayerData {
    id: string; name: string; role?: string; age?: number | string; profilePic?: string;
    basePrice?: number | string; status?: string; category?: string | { name: string; color?: string };
    team?: { name: string; logo?: string } | null;
}

// --- Helpers ---
function formatCurrency(n: number | string | undefined): string {
    const num = Number(n) || 0;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num.toLocaleString("en-IN")}`;
}

export default function OverlayPage() {
    const params = useParams();
    const auctionId = params.auctionId as string;
    const socketRef = useRef<Socket | null>(null);

    // --- State ---
    const [auctionName, setAuctionName] = useState("LIVE AUCTION");
    const [auctionLogo, setAuctionLogo] = useState<string | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<PlayerData | null>(null);
    const [currentBid, setCurrentBid] = useState(0);
    const [biddingTeam, setBiddingTeam] = useState<{ name: string; logo?: string } | null>(null);
    const [soldOverlay, setSoldOverlay] = useState<string | null>(null);
    const [unsoldOverlay, setUnsoldOverlay] = useState(false);
    const [connected, setConnected] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);

    // GSAP related bid display (for smooth counting)
    const [displayBid, setDisplayBid] = useState(0);

    // Customization states
    const [soldEffect, setSoldEffect] = useState("confetti-center");
    const [soldPrice, setSoldPrice] = useState<number | null>(null);
    const [winningTeam, setWinningTeam] = useState<string | null>(null);



    // Trigger selected sold animation when player is sold
    useEffect(() => {
        if (soldOverlay) {
            if (soldEffect === "confetti-center") {
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, zIndex: 9999 });
            } else if (soldEffect === "confetti-cannons") {
                confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, zIndex: 9999 });
                confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, zIndex: 9999 });
            } else if (soldEffect === "confetti-fountain") {
                const end = Date.now() + 1.0 * 1000;
                const colors = ['#34D399', '#ffffff', '#FFD500'];
                (function frame() {
                    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors, zIndex: 9999 });
                    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors, zIndex: 9999 });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
            } else if (soldEffect === "confetti-massive") {
                confetti({ particleCount: 300, spread: 120, startVelocity: 40, origin: { y: 0.1 }, zIndex: 9999 });
            }
        }
    }, [soldOverlay, soldEffect]);

    // --- WebSocket Logic ---
    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
        const socket = io(`${wsUrl}/live-auction`, {
            query: { token: "VIEWER", auctionId },
            reconnection: true,
            transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        socket.on("snapshot_sync", (data: any) => {
            if (data.auctionName) setAuctionName(data.auctionName);
            if (data.logo) setAuctionLogo(data.logo);
            if (data.teams) setTeams(data.teams);
        });
        socket.on("auction_countdown", (data: any) => {
            if (data.auctionName) setAuctionName(data.auctionName);
            if (data.logo) setAuctionLogo(data.logo);
        });

        socket.on("auction_state_update", (data: any) => {
            setCurrentPlayer(data.currentPlayer);
            if (data.currentPlayer) {
                if (data.currentPlayer.status === "SOLD") {
                    setSoldOverlay(`SOLD TO ${data.currentPlayer.teamName || ""}`);
                    setUnsoldOverlay(false);
                    setSoldPrice(Number(data.currentPlayer.soldPrice) || null);
                    setWinningTeam(data.currentPlayer.teamName || null);
                } else if (data.currentPlayer.status === "UNSOLD") {
                    setSoldOverlay(null);
                    setUnsoldOverlay(true);
                    setSoldPrice(null);
                    setWinningTeam(null);
                } else {
                    setSoldOverlay(null);
                    setUnsoldOverlay(false);
                    setSoldPrice(null);
                    setWinningTeam(null);
                }
            } else {
                setSoldOverlay(null);
                setUnsoldOverlay(false);
                setSoldPrice(null);
                setWinningTeam(null);
            }

            if (data.teams) {
                setTeams(prevTeams => {
                    const next = [...prevTeams];
                    data.teams.forEach((newTeam: any) => {
                        const idx = next.findIndex(t => t.id === newTeam.id);
                        if (idx > -1) {
                            next[idx] = { ...next[idx], ...newTeam };
                        } else {
                            next.push(newTeam);
                        }
                    });

                    // Update bidding team based on lastBid and the merged teams list
                    if (data.lastBid) {
                        const t = next.find((x: any) => x.id === data.lastBid.teamId);
                        setBiddingTeam(t ? { name: t.name, logo: t.logo } : null);
                    }

                    return next;
                });
            } else if (data.lastBid) {
                setTeams(prevTeams => {
                    const t = prevTeams.find((x: any) => x.id === data.lastBid.teamId);
                    setBiddingTeam(t ? { name: t.name, logo: t.logo } : null);
                    return prevTeams;
                });
            }

            if (data.lastBid) {
                setCurrentBid(Number(data.lastBid.amount) || 0);
            } else {
                setCurrentBid(0);
                setBiddingTeam(null);
            }

            if (data.settings && data.settings.soldEffect) {
                setSoldEffect(data.settings.soldEffect);
            }
        });

        socket.on("new_player_revealed", (data: any) => {
            setSoldOverlay(null);
            setUnsoldOverlay(false);
            setSoldPrice(null);
            setWinningTeam(null);

            // FIX: Merge the nested player object with the root data object
            // This ensures we capture 'role', 'category', 'age', and 'basePrice'
            const fullPlayerData = {
                ...data.player,
                ...data
            };

            setCurrentPlayer(fullPlayerData);


            // Use the merged data to set the starting bid safely
            setCurrentBid(Number(data.currentBid) || Number(fullPlayerData.basePrice) || 0);
            setBiddingTeam(null);
        });

        socket.on("new_bid_patch", (data: any) => {
            setCurrentBid(Number(data.amount) || 0);
            setBiddingTeam({
                name: data.teamName || data.team?.name || "Competing...",
                logo: data.team?.logo || data.teamLogo
            });
        });

        socket.on("player_sold_confirmed", (data: any) => {
            setSoldOverlay(`SOLD TO ${data.soldTo || data.teamName}`);
            setUnsoldOverlay(false);
            setSoldPrice(Number(data.amount) || null);
            setWinningTeam(data.soldTo || data.teamName || null);
        });

        socket.on("player_unsold_confirmed", () => {
            setSoldOverlay(null);
            setUnsoldOverlay(true);
            setSoldPrice(null);
            setWinningTeam(null);
        });

        return () => { socket.disconnect(); };
    }, [auctionId]);

    // GSAP Counter effect for bid
    useEffect(() => {
        const obj = { val: displayBid };
        gsap.to(obj, {
            val: currentBid,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => setDisplayBid(Math.floor(obj.val))
        });
    }, [currentBid]);

    // Handle edge case if category/role/age is missing
    const getPlayerTags = () => {
        // Default state if no player is loaded
        if (!currentPlayer) return [
            { key: "TYPE", val: "--" },
            { key: "CATEGORY", val: "--" },
            { key: "AGE", val: "--" }
        ];

        // 1. Clean the Role (Removes underscores: "WICKET_KEEPER" -> "WICKET KEEPER")
        let cleanRole = "--";
        if (currentPlayer.role) {
            cleanRole = currentPlayer.role.replace(/_/g, ' ');
        }

        // 2. Safely extract the Category Name from the { name, color } object
        let cleanCategory = "--";
        if (currentPlayer.category) {
            cleanCategory = typeof currentPlayer.category === 'object'
                ? currentPlayer.category.name
                : currentPlayer.category;
        }

        // 3. Handle the Age securely
        const cleanAge = currentPlayer.age ? currentPlayer.age.toString() : "--";

        // Return EXACTLY these three slots so the UI boxes never shift or break
        return [
            { key: "TYPE", val: cleanRole },
            { key: "CATEGORY", val: cleanCategory },
            { key: "AGE", val: cleanAge }
        ];

    };

    const tags = getPlayerTags();

    if (!connected) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center font-poppins overflow-hidden bg-transparent bottom-0 "
            >
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-transparent backdrop-blur-xl rounded-2xl px-12 py-5 border border-white/10 shadow-2xl flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-white/90 font-black tracking-widest uppercase text-xl">Connecting to Server...</span>
                </motion.div>
            </div>
        );
    }

    if (!currentPlayer) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center font-poppins overflow-hidden bg-transparent"
            >
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-transparent backdrop-blur-xl rounded-2xl px-12 py-5 border border-white/10 shadow-2xl flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-black/90 font-black tracking-widest uppercase text-xl">{auctionName} - WAITING FOR NEXT PLAYER</span>
                </motion.div>
            </div>
        );
    }
    return (
        <div className="flex flex-col w-full h-screen relative flex items-end justify-center pb-20 px-10 font-poppins overflow-hidden bg-transparent">

            {/* --- Marketing Watermarks --- */}
            <div className="absolute top-10 left-10 opacity-15 pointer-events-none z-0">
                {auctionLogo ? (
                    <img src={auctionLogo} alt="Auction Logo" className="w-32 h-32 object-contain grayscale brightness-200" />
                ) : (
                    <div className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white/40 font-black text-2xl">AUCTION</span>
                    </div>
                )}
            </div>
            <div className="absolute top-10 right-10 opacity-15 pointer-events-none z-0">
                <img src="/final-1.png" alt="Website Logo" className="w-32 h-32 object-contain grayscale brightness-200" />
            </div>

            {/* --- Status Bar Top --- */}
            <div className="absolute top-10 left-10 flex items-center gap-4 z-50">

                {!connected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/80 text-white text-xs font-black px-4 py-3 rounded-2xl backdrop-blur-sm shadow-xl tracking-widest">
                        RECONNECTING...
                    </motion.div>
                )}
            </div>
            {/* --- Section-1 Style Horizontal Card Layout --- */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={currentPlayer.id}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="fixed left-0 bottom-0 w-full h-fit max-h-[200px] max-w-[100vw] backdrop-blur-2xl bg-gradient-to-r from-gray-900 via-blue-950 to-gray-800 border border-[rgba(255,255,255,0.12)] shadow-2xl p-6 flex flex-row items-center gap-8"
            >
                <div className="fixed flex left-60 bottom-55 w-fit h-fit text-white font-[poppins] text-bold text-5xl sm:text-3xl uppercase tracking-tighter leading-none drop-shadow-lg">
                    {currentPlayer.name}
                </div>
                <div className="w-[1000px] h-1 left-0 bottom-52 fixed ml-60 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
                <div className="w-[1400px] h-1 left-0 bottom-50 fixed ml-10 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>



                {/* Player Information (Middle Left) */}
                <div className="flex flex-col gap-3 pl-20">
                    {/* Base Price Row */}
                    <div className="flex flex-row w-full h-20 px-4 py-3 bg-gradient-to-r from-black to-stone-500/10 rounded-lg outline outline-2 outline-offset-[-2.22px] outline-yellow-600 items-center justify-between">
                        <div className="text-white text-2xl font-bold font-['Inter'] uppercase tracking-wide">Base Price</div>
                        <div className="text-yellow-600 text-3xl font-black font-['Inter']">{formatCurrency(currentPlayer.basePrice)}/-</div>
                    </div>

                    {/* Player Tags Row */}
                    <div className="flex flex-row w-fit rounded-xl shadow-[0px_4px_24px_0px_rgba(255,255,255,0.00)]">

                        {/* TYPE */}
                        <div className="min-w-[160px] px-4 py-3 bg-gradient-to-r from-black to-stone-500/10 rounded-tl-lg rounded-bl-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-yellow-600 flex flex-col justify-center items-start gap-1">
                            <div className="w-full text-zinc-400 text-sm font-bold font-['Inter'] uppercase tracking-wider">{tags[0]?.key}</div>
                            <div className="w-full text-white text-sm font-bold font-['Inter'] uppercase truncate">{tags[0]?.val}</div>
                        </div>

                        {/* CATEGORY */}
                        <div className="min-w-[180px] px-4 py-3 bg-gradient-to-r from-black to-stone-500/10 border-r-[1.50px] border-t-[1.50px] border-b-[1.50px] border-yellow-600 flex flex-col justify-center items-start gap-1">
                            <div className="w-full text-zinc-400 text-sm font-bold font-['Inter'] uppercase tracking-wider">{tags[1]?.key}</div>
                            <div className="w-full text-white text-sm font-bold font-['Inter'] uppercase truncate">{tags[1]?.val}</div>
                        </div>

                        {/* AGE */}
                        <div className="min-w-[100px] px-4 py-3 bg-gradient-to-r from-black to-stone-500/10 rounded-tr-lg rounded-br-lg border-r-[1.50px] border-t-[1.50px] border-b-[1.50px] border-yellow-600 flex flex-col justify-center items-start gap-1">
                            <div className="w-full text-zinc-400 text-sm font-bold font-['Inter'] uppercase tracking-wider">{tags[2]?.key}</div>
                            <div className="w-full text-white text-sm font-bold font-['Inter'] uppercase truncate">{tags[2]?.val}</div>
                        </div>
                    </div>
                </div>

                {/* Profile Pic */}
                <div className="flex flex-col justify-center items-center pl-20">
                    <img className="h-100 pb-20" src="/figma/Line 14 (Stroke).svg" alt="" />
                    <img className="absolute justify-center items-center pl-130 pt-10 z-[-10]" src="/figma/Line 15 (Stroke).svg" alt="" />
                    <img src="/figma/Line 13 (Stroke).svg" alt="" className="absolute justify-center items-center pr-85 z-[-10]" />
                    <div className="relative z-10 translate-y-[-250px] overflow-visible">
                        <div className="w-[230px] h-[230px] shrink-0 rounded-full border-[3px] border-[#FFD500]/50 overflow-hidden bg-white/5 shadow-[0_0_40px_rgba(255,213,0,0.15)]">
                            {currentPlayer.profilePic ? (
                                <img src={currentPlayer.profilePic} alt={currentPlayer.name} className="w-full h-full object-cover" />
                            ) : (
                                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Player Profile" className="w-full h-full object-cover" />
                            )}
                        </div>

                        <AnimatePresence>
                            {soldOverlay && (
                                <motion.div
                                    initial={{ scale: 3, opacity: 0, rotate: -45 }}
                                    animate={{ scale: 1.15, opacity: 1, rotate: -15 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    className="absolute -bottom-6 right-[-20px] w-36 h-36 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col items-center justify-center"
                                >
                                    <img src="/sold-logo.png" alt="SOLD" className="w-full h-full object-contain" />
                                    {winningTeam && (
                                        <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 bg-black/95 text-[#FFD500] font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded border border-white/20 shadow-2xl whitespace-nowrap flex flex-col items-center">
                                            <span>{winningTeam}</span>
                                            {soldPrice !== null && (
                                                <span className="text-white text-[8px] mt-0.5">₹{soldPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {unsoldOverlay && (
                            <div className="absolute -bottom-6 right-[-20px] w-36 h-36 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] pointer-events-none">
                                <img src="/unsold-logo.png" alt="UNSOLD" className="w-full h-full object-contain" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bidding Summary & Team (Right Column) */}
                <div className="flex flex-row items-center gap-6 w-[40%] max-w-[550px] justify-end">
                    {/* Bidding Summary Card */}
                    <div className="flex flex-col justify-center items-center h-[110px] w-[180px] bg-gradient-to-b from-blue-950 to-gray-900 rounded-lg border border-yellow-600/50 shadow-md gap-1.5 shrink-0">
                        <div className="text-[#FFD500] text-sm font-extrabold uppercase tracking-wider">Current Bid</div>
                        <div className="text-white text-3xl font-black font-['Inter'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            ₹{displayBid.toLocaleString("en-IN")}/-
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-[100px] bg-white/10 shrink-0" />

                    {/* Bidding Team Section */}
                    <div className="w-[180px] flex flex-col items-center justify-center gap-2 relative shrink-0">
                        <AnimatePresence mode="wait">
                            {biddingTeam ? (
                                <motion.div
                                    key={biddingTeam.name}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex flex-col items-center w-full gap-1.5"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 p-2 shadow-lg backdrop-blur-md flex items-center justify-center overflow-hidden">
                                        {biddingTeam.logo ? (
                                            <img src={biddingTeam.logo} alt={biddingTeam.name} className="w-full h-full object-contain drop-shadow-md" />
                                        ) : (
                                            <span className="text-[#FFD500] font-black text-xl">{biddingTeam.name?.substring(0, 2).toUpperCase() || "TM"}</span>
                                        )}
                                    </div>
                                    <div className="text-center w-full">
                                        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none block">Leading Bid</span>
                                        <span className="text-[#FFD500] font-black text-sm uppercase truncate block w-full mt-1 drop-shadow-sm leading-none" title={biddingTeam.name}>
                                            {biddingTeam.name}
                                        </span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                                    <div className="w-14 h-14 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-white/5" />
                                    <span className="text-white/50 text-[9px] font-black uppercase tracking-widest">Awaiting Bid</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Screen Flash Strobe Overlay */}
            <AnimatePresence>
                {soldOverlay && soldEffect === "flash" && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="fixed inset-0 bg-white z-[9999] pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
                .font-poppins { font-family: 'Poppins', sans-serif; }
                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.12); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.12); }
                    70% { transform: scale(1); }
                }
                .animate-heartbeat { animation: heartbeat 1s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
