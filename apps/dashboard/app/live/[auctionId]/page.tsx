"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/auth.store";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Users, LayoutDashboard, Settings, User, Trophy, Play, CheckCircle, XCircle, RotateCcw, AlertTriangle, Menu, Maximize, Monitor } from "lucide-react";
import confetti from "canvas-confetti";

const auctionLogo = "/logo-1.svg";

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
};

export default function OrganizerLiveDashboard() {
    const params = useParams();
    const router = useRouter();
    const auctionId = params.auctionId as string;
    const { firebaseToken } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);
    const isNavigatingAway = useRef(false);

    const [windowWidth, setWindowWidth] = useState(0);
    const [showDesktopWarning, setShowDesktopWarning] = useState(false);
    const isDesktop = windowWidth >= 1024;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!isDesktop && windowWidth > 0) {
            setShowDesktopWarning(true);
        } else {
            setShowDesktopWarning(false);
        }
    }, [isDesktop, windowWidth]);

    // Customization states
    const [isSold, setIsSold] = useState(false);
    const [soldToTeam, setSoldToTeam] = useState("");
    const [soldEffect, setSoldEffect] = useState("confetti-center");
    const [isUnsold, setIsUnsold] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [confettiEnabled, setConfettiEnabled] = useState(true);

    // Fortune Wheel states
    const [showWheel, setShowWheel] = useState(false);
    const [selectedTeamsForWheel, setSelectedTeamsForWheel] = useState<string[]>([]);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [isWheelSpinning, setIsWheelSpinning] = useState(false);
    const [wheelWinner, setWheelWinner] = useState<any>(null);
    const [showWinnerConfirm, setShowWinnerConfirm] = useState(false);



    const spinWheel = () => {
        if (isWheelSpinning || selectedTeamsForWheel.length === 0) return;

        setIsWheelSpinning(true);
        setWheelWinner(null);
        setShowWinnerConfirm(false);

        const randomIndex = Math.floor(Math.random() * selectedTeamsForWheel.length);
        const winningTeamId = selectedTeamsForWheel[randomIndex];
        const winningTeam = teams.find(t => t.id === winningTeamId);

        const N = selectedTeamsForWheel.length;
        const sliceAngle = 360 / N;
        const winnerMidAngle = randomIndex * sliceAngle + (sliceAngle / 2);

        const spins = 5;
        const targetRotation = wheelRotation + (spins * 360) + (360 - (wheelRotation % 360)) + (360 - winnerMidAngle);

        setWheelRotation(targetRotation);

        setTimeout(() => {
            setIsWheelSpinning(false);
            setWheelWinner(winningTeam);
            setShowWinnerConfirm(true);
        }, 5000);
    };



    const triggerConfetti = (effect: string) => {
        if (effect === "confetti-center") {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, zIndex: 9999 });
        } else if (effect === "confetti-cannons") {
            confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, zIndex: 9999 });
            confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, zIndex: 9999 });
        } else if (effect === "confetti-fountain") {
            const end = Date.now() + 1.0 * 1000;
            const colors = ['#34D399', '#ffffff', '#FFD500'];
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: colors, zIndex: 9999 });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: colors, zIndex: 9999 });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        } else if (effect === "confetti-massive") {
            confetti({ particleCount: 300, spread: 120, startVelocity: 40, origin: { y: 0.1 }, zIndex: 9999 });
        }
    };

    // Connected state
    const [connected, setConnected] = useState(false);
    const [activeTab, setActiveTab] = useState("LIVE");

    // Auction State
    const [teams, setTeams] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalPlayers: 0, unsold: 0 });
    const [status, setStatus] = useState("OFFLINE");
    const [dashboardSnapshot, setDashboardSnapshot] = useState<any>(null);
    const [AuctionInfo, setAuctionInfo] = useState<any>(null);
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [soldPrice, setSoldPrice] = useState<number | null>(null);
    const [currentBid, setCurrentBid] = useState<number>(0);
    const [nextBidAmount, setNextBidAmount] = useState<number>(0);
    const [topBidderName, setTopBidderName] = useState<string>("None");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [playerFilter, setPlayerFilter] = useState("ALL");
    const [selectedTeam, setSelectedTeam] = useState<any>(null);

    useEffect(() => {
        if (showWheel && teams.length > 0) {
            setSelectedTeamsForWheel(teams.map(t => t.id));
            setWheelWinner(null);
            setShowWinnerConfirm(false);
        }
    }, [showWheel, teams]);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem("confettiEnabled");
            if (saved !== null) {
                setConfettiEnabled(saved === "true");
            } else {
                window.localStorage.setItem("confettiEnabled", "true");
                setConfettiEnabled(true);
            }
        } catch (e) { }
    }, []);
    // Setup Socket
    useEffect(() => {
        if (!firebaseToken || !auctionId) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
        const socket = io(`${wsUrl}/live-auction`, {
            query: { token: firebaseToken, auctionId },
            reconnection: true,
            transports: ["websocket", "polling"],
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            toast.dismiss("socket-disconnect");
            toast.success("Connected to auction server!", { duration: 3000 });
            socket.emit("init_auction", { auctionId });
        });

        socket.on("disconnect", () => {
            setConnected(false);
            if (!isNavigatingAway.current) {
                toast.error("Lost connection. Reconnecting to auction system...", {
                    id: "socket-disconnect",
                    duration: Infinity,
                });
            }
        });

        socket.on("connect_error", () => {
            setConnected(false);
            if (!isNavigatingAway.current) {
                toast.error("Unable to connect. Reconnecting to auction system...", {
                    id: "socket-disconnect",
                    duration: Infinity,
                });
            }
        });

        socket.on("auction_state_update", (data: any) => {
            if (data.auctionName || data.logo) {
                setAuctionInfo((prev: any) => ({
                    ...prev,
                    auctionName: data.auctionName || prev?.auctionName,
                    logo: data.logo || prev?.logo,
                }));
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
                    return next;
                });
            }
            if (data.categories && data.categories.length > 0) setCategories(data.categories);
            if (data.stats) setStats(data.stats);
            if (data.status) setStatus(data.status);
            if (data.settings) {
                setSettings(data.settings);
                if (data.settings.soldEffect) {
                    setSoldEffect(data.settings.soldEffect);
                }
            }

            if (data.currentPlayer) {
                setCurrentPlayer(data.currentPlayer);
                if (data.currentPlayer.status === "SOLD") {
                    setIsSold(true);
                    setIsUnsold(false);
                    const t = data.teams?.find((x: any) => x.id === data.currentPlayer.teamId || x.name === data.currentPlayer.teamName);
                    setSoldToTeam(t ? t.name : (data.currentPlayer.teamName || ""));
                    setSoldPrice(Number(data.currentPlayer.soldPrice) || null);
                } else if (data.currentPlayer.status === "UNSOLD") {
                    setIsSold(false);
                    setIsUnsold(true);
                    setSoldToTeam("");
                    setSoldPrice(null);
                } else {
                    setIsSold(false);
                    setIsUnsold(false);
                    setSoldToTeam("");
                    setSoldPrice(null);
                }
            } else {
                setCurrentPlayer(null);
                setIsSold(false);
                setIsUnsold(false);
                setSoldToTeam("");
                setSoldPrice(null);
            }

            if (data.lastBid) {
                setCurrentBid(data.lastBid.amount);
                const t = data.teams?.find((x: any) => x.id === data.lastBid.teamId);
                setTopBidderName(t ? t.name : "Unknown");
            } else {
                setCurrentBid(0);
                setTopBidderName("None");
            }
        });

        socket.on("dashboard_snapshot", (data: any) => {
            setDashboardSnapshot(data);
            if (data.categories) setCategories(data.categories);
        });

        socket.on("auction_countdown", (data: any) => {
            setAuctionInfo(data);
        })

        socket.on("new_player_revealed", (data: any) => {
            toast.dismiss("select-player");
            setActiveTab("LIVE");
            setStatus("BIDDING");
            const fullPlayer = { ...data.player, ...data };
            setCurrentPlayer(fullPlayer);
            setIsSold(false);
            setIsUnsold(false);
            setSoldToTeam("");
            setSoldPrice(null);

            const cBid = data.currentBid || fullPlayer.basePrice || 0;
            setCurrentBid(cBid);
            setNextBidAmount(data.nextBid || cBid + 500);

            if (data.lastBid) {
                setTeams((prev) => {
                    const t = prev.find((x) => x.id === data.lastBid.teamId);
                    setTopBidderName(t ? t.name : "Unknown");
                    return prev;
                });
            } else {
                setTopBidderName("None");
            }
        });

        socket.on("new_bid_patch", (data: any) => {
            setCurrentBid(data.amount);

            // Update specific team budget optimistically
            setTeams((prev) => prev.map(t =>
                t.id === data.teamId ? { ...t, purse: data.remainingBudget } : t
            ));

            setTopBidderName(data.teamName || "Unknown");

            const nBid = data.nextBid || (data.amount + 500);
            setNextBidAmount(nBid);
        });

        socket.on("player_sold_patch", (p: any) => {
            setDashboardSnapshot((prev: any) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    players: {
                        ...prev.players,
                        upcoming: prev.players?.upcoming?.filter((x: any) => x.id !== p.id) || [],
                        unsold: prev.players?.unsold?.filter((x: any) => x.id !== p.id) || [],
                        sold: [...(prev.players?.sold || []), p]
                    }
                };
            });
            setIsSold(true);
            setIsUnsold(false);
            setStatus("WAITING");
            setSoldToTeam(p.teamName || "");
            setSoldPrice(Number(p.soldPrice) || null);
            setCurrentPlayer(p);
            toast.success(`Sold! ${p.name} is now with ${p.teamName}!`);

            if (confettiEnabled) {
                triggerConfetti(soldEffect);
            }
        });

        socket.on("player_unsold_patch", (p: any) => {
            setDashboardSnapshot((prev: any) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    players: {
                        ...prev.players,
                        upcoming: prev.players?.upcoming?.filter((x: any) => x.id !== p.id) || [],
                        sold: prev.players?.sold?.filter((x: any) => x.id !== p.id) || [],
                        unsold: [...(prev.players?.unsold || []), { ...p, status: "UNSOLD" }]
                    }
                };
            });
            setIsSold(false);
            setIsUnsold(true);
            setStatus("WAITING");
            setSoldToTeam("");
            setSoldPrice(null);
            setCurrentPlayer(p);
            toast.error(`${p.name} went Unsold this time.`);
        });

        socket.on("player_reauction_patch", ({ ids }: { ids: string[] }) => {
            setDashboardSnapshot((prev: any) => {
                if (!prev) return prev;
                const moving = (prev.players?.unsold || []).filter((p: any) => ids.includes(p.id));
                return {
                    ...prev,
                    players: {
                        ...prev.players,
                        unsold: prev.players?.unsold?.filter((p: any) => !ids.includes(p.id)) || [],
                        upcoming: [...(prev.players?.upcoming || []), ...moving]
                    }
                };
            });
            setIsSold(false);
            setIsUnsold(false);
            setStatus("WAITING");
            setSoldToTeam("");
            setSoldPrice(null);
            setCurrentPlayer(null);
            toast.info("Unsold players have been moved back to the queue.");
        });

        socket.on("team_updated_patch", (t: any) => {
            setTeams((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...t } : x)));
        });

        socket.on("bid_undone", (data: any) => {
            if (data.lastBid) {
                setCurrentBid(data.lastBid.amount);
                setTopBidderName(data.lastBid.teamName || "Unknown");
                setNextBidAmount(data.nextBid || data.lastBid.amount + 500);
            } else {
                setCurrentBid(0);
                setTopBidderName("None");
                setNextBidAmount(0);
            }
            setIsSold(false);
            setIsUnsold(false);
            setStatus("BIDDING");
            setSoldToTeam("");
            setSoldPrice(null);
            setCurrentPlayer((prev: any) => prev ? { ...prev, status: "UPCOMING", soldPrice: null, teamId: null, teamName: null } : null);
            toast.info("The last action has been undone.");
        });

        socket.on("auction_ended", (data: any) => {
            toast.success("Auction has been completed and archived!");
            router.push(`/dashboard/manage/${auctionId}/details`);
        });

        socket.on("error", (msg: string) => {
            toast.dismiss("select-player");
            toast.error(msg);
        });

        return () => {
            isNavigatingAway.current = true;
            socket.disconnect();
            toast.dismiss("socket-disconnect");
        };

    }, [auctionId, firebaseToken]);


    // Action Handlers
    const selectPlayer = (mode: string) => {
        if (!socketRef.current) return;
        toast.loading("Drawing next player...", { id: "select-player" });
        socketRef.current.emit("select_player", {
            auctionId,
            mode,
            categoryId: selectedCategoryId === "" ? null : selectedCategoryId,
            playerNo: null,
        });
    };

    const placeBid = (teamId: string) => {
        if (!socketRef.current || !currentPlayer) return;
        socketRef.current.emit("place_bid", {
            auctionId,
            teamId,
            amount: nextBidAmount,
        });
    };

    const markSold = () => socketRef.current?.emit("mark_sold", { auctionId });
    const markUnsold = () => socketRef.current?.emit("mark_unsold", { auctionId });
    const undoLastBid = () => socketRef.current?.emit("undo_bid", { auctionId });
    const confirmSold = () => socketRef.current?.emit("confirm_sold", { auctionId });
    const resumeBidding = () => socketRef.current?.emit("reopen_bidding", { auctionId });
    const reauctionUnsold = () => socketRef.current?.emit("reauction_unsold", { auctionId });

    const endAuction = (force = false) => {
        if (!socketRef.current) return;
        socketRef.current.emit("end_auction", { auctionId, force }, (res: any) => {
            if (res) {
                if (res.status === "WARNING") {
                    if (confirm(`${res.message}\nAre you sure you want to FORCE END the auction? This will mark all remaining players as UNSOLD.`)) {
                        endAuction(true);
                    }
                } else if (res.status === "BLOCKED") {
                    toast.error(res.message || "Failed to end auction.");
                } else if (res.status === "COMPLETED") {
                    toast.success(res.message || "Auction successfully ended!");
                    router.push(`/dashboard/manage/${auctionId}/details`);
                } else if (res.error) {
                    toast.error(res.error);
                }
            } else {
                toast.error("Failed to end the auction. Please try again.");
            }
        });
    };

    const handleSoldClick = () => {
        if (!currentPlayer) return;
        if (topBidderName === "None" || topBidderName === "Unknown") {
            toast.error("No team has placed a bid on this player yet!");
            return;
        }
        confirmSold();
    };

    const handleUnsoldClick = () => {
        if (!currentPlayer) return;
        markUnsold();
    };

    const upcoming = dashboardSnapshot?.players?.upcoming || [];
    const unsold = dashboardSnapshot?.players?.unsold || [];
    const todo = [...upcoming, ...unsold];
    const sold = dashboardSnapshot?.players?.sold || [];

    const pageOrigin = typeof window !== "undefined" ? window.location.origin : "";

    return (
        <div
            className="relative flex flex-col h-screen w-full text-white font-poppins"
            style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #1A2154 22%, #1A1A1B 40%, #1A2163 51%, #1A1A40 71%, #1A1A1A 100%)',
                overflow: 'hidden'
            }}
        >
            {/* Header - with larger logo and horizontal line */}
            <header className="h-16 border-b border-white/10 px-8 flex items-center justify-between shrink-0 bg-black/20 backdrop-blur-md relative">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden bg-black/50 flex items-center justify-center relative">
                        {AuctionInfo?.logo ? (
                            <img src={AuctionInfo.logo} alt="Logo" className="w-full h-full object-cover z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            <img src="/icon1.png" alt="Logo" className="w-full h-full object-cover z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        )}
                    </div>
                    <h1 className="text-md font-black text-white tracking-widest uppercase shadow-black drop-shadow-md">{AuctionInfo?.auctionName}</h1>
                </div>

                {/* Horizontal decorative line under header - added */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                <div className="flex h-full gap-2">
                    {["LIVE", "PLAYERS", "TEAMS", "CATEGORIES", "BOOSTER", "SETTINGS"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`h-full px-4 flex items-center justify-center font-bold text-xs tracking-widest uppercase transition-all relative cursor-pointer
                    ${activeTab === tab ? "text-white" : "text-white/40 hover:text-white/80"}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="headerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-md shadow-[0_0_10px_#ffffff]" />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden p-2 pb-24 relative ">
                <img src="/live-auction-photo/line-14.png" alt="line-14" className="absolute top-0 left-40 w-full h-80 object-cover z-0" />
                <img src="/live-auction-photo/line-15.png" alt="line-15" className="absolute top-0 left-180 w-fit h-120 object-cover z-0" />
                <img src="/live-auction-photo/line-16.png" alt="line-16" className="absolute top-100 left-113.5 w-fit h-55  object-cover z-0" />

                {/* Branding Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0 overflow-hidden">
                    {auctionLogo ? (
                        <div className="flex items-center justify-center">
                            <img src="/circle.png" alt="Auction Logo" className="absolute w-[280px] h-[280px] object-contain grayscale brightness-100 blur-[1px]" />
                            <img src="/final-1.png" alt="Auction Logo" className="absolute w-[200px] h-[200px] object-contain grayscale brightness-200 blur-[1px]" />

                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative flex items-center justify-center">
                                <div className="w-96 h-96 border-[20px] border-white/10 rounded-full flex items-center justify-center">
                                    <span className="text-white/50 font-black text-5xl tracking-tighter  select-none">Auction 11</span>
                                </div>
                                <div className="absolute w-[450px] h-[450px] border-2 border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute w-[500px] h-[500px] border border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                            </div>
                        </div>
                    )}
                </div>


                {/* LIVE TAB - Left/Right Split */}
                {activeTab === "LIVE" && (
                    <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center gap-12 p-8 lg:p-12 overflow-y-auto custom-scrollbar z-10">
                        {currentPlayer ? (
                            <>
                                {/* Left: Player Rectangular Card (glowing blue border like logo-1.png) */}
                                <div className="relative shrink-0">
                                    <div className="w-[280px] h-[350px] lg:w-[320px] lg:h-[400px] rounded-3xl border-4 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden bg-black/50 relative group">
                                        <img src={currentPlayer.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover relative z-10" alt="Player" />
                                    </div>
                                    <AnimatePresence>
                                        {isSold && (
                                            <motion.div
                                                initial={{ scale: 3, opacity: 0, rotate: -45 }}
                                                animate={{ scale: 1.1, opacity: 1, rotate: -15 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[15%] w-44 h-44 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col items-center justify-center"
                                            >
                                                <img src="/sold-logo.png" alt="SOLD" className="w-full h-full object-contain animate-[heartbeat_1s_ease-in-out_infinite]" />
                                                {soldToTeam && (
                                                    <div className="absolute bottom-2 left-1/3 -translate-x-1/4 -rotate-[15deg] bg-black/90 text-[#FFD500] font-black text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20 shadow-xl whitespace-nowrap">
                                                        {soldToTeam}
                                                        <span className="text-white text-[10px] font-bold">₹{Number(soldPrice || currentBid || 0).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {isUnsold && (
                                        <div
                                            className="absolute bottom-0 right-0 translate-x-[15%] translate-y-[15%] w-44 h-44 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col items-center justify-center"
                                        >
                                            <img src="/unsold-logo.png" alt="UNSOLD" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>

                                {/* Middle: Player Statistics Table */}
                                <div className="flex-1 flex flex-col justify-center min-w-[280px] max-w-md">
                                    <h1 className="text-2xl lg:text-3xl font-black text-[#FFD500] uppercase tracking-wide mb-6 leading-tight whitespace-normal break-words" title={currentPlayer.name}>
                                        {currentPlayer.name}
                                    </h1>

                                    {/* Stats list with borders */}
                                    <div className="flex flex-col w-full border-t border-white/10 mt-2">
                                        <div className="flex justify-between items-center border-b border-white/10 py-3 text-xs lg:text-sm uppercase font-bold">
                                            <span className="text-white/40 tracking-widest">Type</span>
                                            <span className="text-white font-black">{currentPlayer.role?.replace(/_/g, " ") || "--"}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 py-3 text-xs lg:text-sm uppercase font-bold">
                                            <span className="text-white/40 tracking-widest">Category</span>
                                            <span className="text-white font-black">{currentPlayer.category?.name || currentPlayer.category || "UNRANKED"}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 py-3 text-xs lg:text-sm uppercase font-bold">
                                            <span className="text-white/40 tracking-widest">Age</span>
                                            <span className="text-white font-black">{currentPlayer.age || "--"}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-lg lg:text-xl font-bold uppercase text-white">
                                        Base Price <span className="text-white/40 mx-1">-</span> <span className="text-yellow-400 font-black text-2xl lg:text-3xl">₹{(currentPlayer.basePrice || 0).toLocaleString()}/-</span>
                                    </div>
                                </div>

                                {/* Right: Bidding Info Card (glowing border with team name logo left) */}
                                <div className="flex flex-col gap-6 w-80 shrink-0">
                                    {/* Current Bidding Team Info */}
                                    {topBidderName !== "None" && topBidderName !== "Unknown" ? (
                                        <div className="bg-black/40 border border-[#FFD500]/30 shadow-[0_0_20px_rgba(255,213,0,0.15)] rounded-3xl p-6 flex flex-col items-center text-center gap-4 backdrop-blur-md">
                                            <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center p-2 border border-white/10 shrink-0 overflow-hidden">
                                                {teams.find((t: any) => t.name === topBidderName)?.logo ? (
                                                    <img src={teams.find((t: any) => t.name === topBidderName).logo} className="w-full h-full object-contain rounded-full" />
                                                ) : (
                                                    <div className="text-xl font-bold text-white/50">{teams.find((t: any) => t.name === topBidderName)?.shortName || topBidderName?.substring(0, 2) || "TM"}</div>
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block">Current Bidder</span>
                                                <h3 className="text-white font-black text-lg uppercase tracking-wider mt-1 whitespace-normal break-words" title={topBidderName}>{topBidderName}</h3>

                                                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-white/10 text-xs">
                                                    <div className="flex justify-between items-center py-1">
                                                        <span className="text-white/40 uppercase font-bold tracking-wider">Purse Remaining</span>
                                                        <span className="text-yellow-400 font-black">₹{(teams.find((t: any) => t.name === topBidderName)?.purse || 0).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1">
                                                        <span className="text-white/40 uppercase font-bold tracking-wider">Players Bought</span>
                                                        <span className="text-[#34D399] font-black">{teams.find((t: any) => t.name === topBidderName)?.playersCount || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-black/20 border border-dashed border-white/10 rounded-3xl p-6 text-center text-white/30 text-xs font-bold">
                                            No bids placed yet
                                        </div>
                                    )}

                                    {/* Current Bid Display */}
                                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                                        <span className="text-white/40 text-xs font-black uppercase tracking-widest">Current Bid</span>
                                        <span className="text-4xl lg:text-5xl font-black text-[#34D399] mt-2 drop-shadow-md">₹{(currentBid || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-white/30 text-4xl font-black uppercase tracking-widest mt-18 text-center">
                                <User size={64} className="mx-auto mb-6 opacity-30" />
                                Awaiting Player...
                            </div>
                        )}
                    </div>
                )}

                {/* PLAYERS TAB */}
                {activeTab === "PLAYERS" && (
                    <div className="w-full h-full flex flex-col gap-6">
                        {/* Filters container */}
                        <div className="flex items-center flex-wrap gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 shrink-0 shadow-lg backdrop-blur-md">
                            {["ALL", "AVAILABLE", "SOLD", "UNSOLD"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setPlayerFilter(f)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-md cursor-pointer ${playerFilter === f ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-white/5 hover:bg-white/10 text-white/50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                            <div className="ml-auto flex items-center gap-4">
                                <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-xs font-black uppercase outline-none text-white focus:border-white transition-colors cursor-pointer"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="" className="bg-black">All Categories</option>
                                    {categories.map((c: any) => (
                                        <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
                                    ))}
                                </select>
                                <select className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-xs font-black uppercase outline-none text-white focus:border-white transition-colors cursor-pointer">
                                    <option value="" className="bg-black">Target Age Group</option>
                                    <option value="U19" className="bg-black">U19</option>
                                    <option value="SENIOR" className="bg-black">Senior</option>
                                </select>
                            </div>
                        </div>

                        {/* Player Cards Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-2">
                                {(() => {
                                    let list: any[] = [];
                                    if (playerFilter === 'ALL') {
                                        list = [...upcoming, ...unsold, ...sold];
                                    } else if (playerFilter === 'AVAILABLE') {
                                        list = upcoming;
                                    } else if (playerFilter === 'SOLD') {
                                        list = sold;
                                    } else if (playerFilter === 'UNSOLD') {
                                        list = unsold;
                                    }
                                    return list.filter((p: any) => {
                                        if (selectedCategoryId !== "" && p.categoryId !== selectedCategoryId) return false;
                                        return true;
                                    });
                                })().map((p: any) => (
                                    <div key={p.id} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl p-5 flex flex-col items-center relative overflow-hidden group transition-all shadow-md cursor-pointer">
                                        <img src={p.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-20 h-20 rounded-full object-cover mb-4 bg-black/50 border border-white/10 group-hover:border-white/30 transition-colors shadow-inner" alt="Player" />
                                        <h3 className="font-black text-sm uppercase text-center leading-tight truncate w-full px-2" title={p.name}>{p.name}</h3>
                                        <p className="text-[10px] text-white/50 uppercase font-bold mt-1 tracking-wider">{p.role?.replace(/_/g, " ") || "--"}</p>

                                        {p.teamName ? (
                                            <div className="mt-5 w-full bg-green-500/20 text-white/50 py-2 rounded-xl text-center text-[10px] font-black uppercase border border-green-500/20 shadow-inner">
                                                Sold ₹{(p.soldPrice || 0).toLocaleString()} To
                                                <span className="text-[10px] text-white/50 uppercase font-bold mt-1 tracking-wider"> {p.teamName}</span>
                                            </div>
                                        ) : p.status === 'UNSOLD' ? (
                                            <div className="mt-5 w-full bg-red-500/20 text-red-500 py-2 rounded-xl text-center text-[10px] font-black uppercase border border-red-500/20 shadow-inner">Unsold</div>
                                        ) : (
                                            <div className="mt-5 w-full bg-white/5 text-white/50 py-2 rounded-xl text-center text-[10px] font-black uppercase border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner">Available</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TEAMS TAB */}
                {activeTab === "TEAMS" && (
                    <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 pb-8">
                            {teams.map((t: any) => (
                                <div key={t.id} onClick={() => setSelectedTeam(t)} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all group overflow-hidden relative shadow-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center p-1 shrink-0 group-hover:border-white/30 transition-colors">
                                            {t.logo ? <img src={t.logo} className="w-full h-full object-contain" /> : <div className="text-xs font-bold text-white/50">{t.shortName}</div>}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-black text-lg uppercase leading-tight truncate" title={t.name}>{t.name}</h3>
                                            <span className="text-yellow-400 font-black text-sm mt-1 drop-shadow-md">₹{(t.purse || 0).toLocaleString()} <span className="text-white/40 text-xs">left</span></span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                                        <div className="flex flex-col text-center border-r border-white/10">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Players</span>
                                            <span className="font-bold text-base">{t.playersCount || 0}</span>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Max Bid</span>
                                            <span className="font-bold  text-base">₹{(t.maxAllowedBid || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {/* Additional team stats */}
                                    <div className="flex justify-between mt-4 pt-3 border-t border-white/10 text-[11px] font-bold">
                                        <div className="flex items-center gap-1">
                                            <span className="text-white/40">🔒 Reserved:</span>
                                            <span className="text-white">₹{(t.reserved || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-white/40">⚡ Boosters:</span>
                                            <span className="text-yellow-400">{t.boostersUsed || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === "CATEGORIES" && (
                    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl">
                        <h2 className="text-white/40 text-sm font-black tracking-widest uppercase mb-8">Auction Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.map((c: any) => (
                                <div key={c.id} onClick={() => { setSelectedCategoryId(c.id); setActiveTab("PLAYERS"); }} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg group">
                                    <h3 className="font-black text-xl uppercase tracking-widest group-hover:text-yellow-400 transition-colors">{c.name}</h3>
                                    <span className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs font-bold text-white/70">{c.playersCount || 0} Players</span>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="col-span-full text-center text-white/30 uppercase font-black text-xl p-12">No categories found</div>
                            )}
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === "SETTINGS" && (
                    <div className="w-full h-full max-w-6xl mx-auto flex gap-12 items-start py-8 overflow-y-auto">
                        <div className="flex-1 flex flex-col gap-8">
                            <div>
                                <h2 className="text-white/40 text-sm font-black uppercase tracking-widest mb-6 px-2 block">System Configuration</h2>
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 shadow-xl backdrop-blur-md">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-widest">Visual Effects</span>
                                            <span className="text-[10px] text-white/40 font-bold uppercase mt-1">Toggle Confetti (Saved)</span>
                                        </div>
                                        <button onClick={() => {
                                            const val = !confettiEnabled;
                                            setConfettiEnabled(val);
                                            try {
                                                window.localStorage.setItem("confettiEnabled", String(val));
                                            } catch (e) { }
                                        }} className={`w-14 h-8 rounded-full transition-colors relative flex items-center shadow-inner cursor-pointer ${confettiEnabled ? 'bg-yellow-500' : 'bg-black/80 border border-white/10'}`}>
                                            <div className={`w-6 h-6 rounded-full absolute transition-all shadow-md ${confettiEnabled ? 'right-1 bg-white' : 'left-1 bg-white/50'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-widest">Re-Auction Players</span>
                                            <span className="text-[10px] text-white/40 font-bold uppercase mt-1">Moves all unsold to upcoming queue</span>
                                        </div>
                                        <button onClick={reauctionUnsold} className="px-6 py-2.5 bg-white/5 text-white/80 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer">
                                            Trigger Now
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border border-red-500/20 hover:border-red-500/30 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase tracking-widest text-red-400">End Auction Session</span>
                                            <span className="text-[10px] text-white/40 font-bold uppercase mt-1">Completes and archives the live auction</span>
                                        </div>
                                        <button onClick={() => endAuction(false)} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase transition-colors cursor-pointer border border-red-500">
                                            End Auction
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-white/40 text-sm font-black uppercase tracking-widest mb-6 px-2">Draw Player Type</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <button onClick={() => { setActiveTab('LIVE'); selectPlayer('SEQUENCE'); }} className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 rounded-3xl p-8 text-center flex flex-col items-center justify-center transition-all group active:scale-95 shadow-xl backdrop-blur-md cursor-pointer">
                                        <h3 className="font-black uppercase text-xl group-hover:text-yellow-400 mb-2 transition-colors">Sequential</h3>
                                        <p className="text-xs text-white/40 font-bold">Pulls the next exact player</p>
                                    </button>
                                    <button onClick={() => { setActiveTab('LIVE'); selectPlayer('RANDOM'); }} className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 rounded-3xl p-8 text-center flex flex-col items-center justify-center transition-all group active:scale-95 shadow-xl backdrop-blur-md cursor-pointer">
                                        <h3 className="font-black uppercase text-xl group-hover:text-yellow-400 mb-2 transition-colors">Random</h3>
                                        <p className="text-xs text-white/40 font-bold">Pulls a randomized player</p>
                                    </button>
                                </div>
                            </div>

                            {/* NEW: Auction Rules & Details */}
                            <div>
                                <h2 className="text-white/40 text-sm font-black uppercase tracking-widest mb-6 px-2">Auction Rules & Info</h2>
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 shadow-xl backdrop-blur-md">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Base Starting Bid</span>
                                            <span className="font-bold text-base mt-1 text-yellow-400">₹{(settings?.minBid || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Default Bid Increment</span>
                                            <span className="font-bold text-base mt-1 text-white">₹{(settings?.bidIncrease || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Starting Team Budget</span>
                                            <span className="font-bold text-base mt-1 ">₹{(settings?.budgetPerTeam || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Roster Limits (Min/Max)</span>
                                            <span className="font-bold text-base mt-1 text-white">{settings?.minPlayerPerTeam || 0} - {settings?.maxPlayersPerTeam || 0} Players</span>
                                        </div>
                                    </div>

                                    {/* Bidding Rules Thresholds - if bidRules exists */}
                                    {settings?.bidRules && settings.bidRules.length > 0 && (
                                        <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Incremental Bidding Thresholds</span>
                                            <div className="flex flex-col gap-2 mt-1">
                                                {Array.isArray(settings.bidRules) ? (
                                                    settings.bidRules.map((rule: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0 font-medium">
                                                            <span className="text-white/60">If bid is &ge; ₹{Number(rule.threshold).toLocaleString()}</span>
                                                            <span className="text-yellow-400 font-bold">+₹{Number(rule.increment).toLocaleString()}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-white/50">{JSON.stringify(settings.bidRules)}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-8">
                            {/* Pick Player from Category Section */}
                            <div>
                                <h2 className="text-white/40 text-sm font-black uppercase tracking-widest mb-6 px-2">Pick Player from Category</h2>
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 shadow-xl backdrop-blur-md">
                                    <div className="flex flex-col gap-4">
                                        <label className="text-xs text-white/50 font-black uppercase tracking-widest">Select Category</label>
                                        <select
                                            value={selectedCategoryId}
                                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-white/30 transition-colors cursor-pointer"
                                        >
                                            <option value="" className="bg-black">All Categories (No Filter)</option>
                                            {categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.id} className="bg-black">{cat.name} ({cat.playersCount || 0} players)</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => { setActiveTab('LIVE'); selectPlayer('SEQUENCE'); }}
                                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase transition-all cursor-pointer shadow-lg active:scale-95 text-white"
                                            >
                                                Draw Selected (Sequential)
                                            </button>
                                            <button
                                                onClick={() => { setActiveTab('LIVE'); selectPlayer('RANDOM'); }}
                                                className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl text-xs font-black uppercase text-[#012972] transition-all cursor-pointer shadow-lg active:scale-95"
                                            >
                                                Draw Selected (Random)
                                            </button>
                                        </div>
                                        {selectedCategoryId && (
                                            <p className="text-[10px] text-green-400 font-bold text-center mt-2">
                                                Currently filtering: {categories.find(c => c.id === selectedCategoryId)?.name || "Selected Category"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-white/40 text-sm font-black uppercase tracking-widest px-2">Auction Links</h2>
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col gap-8 shadow-xl backdrop-blur-md">
                                    <div>
                                        <label className="text-[10px] text-white/50 font-black uppercase tracking-widest pl-2 mb-2 block">Overlay View (OBS/Live Streaming)</label>
                                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 transition-colors focus-within:border-white/30">
                                            <input readOnly value={`${pageOrigin}/overlay/${auctionId}`} className="flex-1 bg-transparent px-4 py-2 text-xs font-bold text-white outline-none font-mono" />
                                            <button onClick={() => { navigator.clipboard.writeText(`${pageOrigin}/overlay/${auctionId}`); toast.success("Overlay link copied!") }} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-black uppercase transition-colors shrink-0 cursor-pointer text-white">Copy Link</button>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-white/10" />
                                    <div>
                                        <label className="text-[10px] text-white/50 font-black uppercase tracking-widest pl-2 mb-2 block">Public Spectator View</label>
                                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 transition-colors focus-within:border-white/30">
                                            <input readOnly value={`${pageOrigin}/viewer/${auctionId}`} className="flex-1 bg-transparent px-4 py-2 text-xs font-bold text-white outline-none font-mono" />
                                            <button onClick={() => { navigator.clipboard.writeText(`${pageOrigin}/viewer/${auctionId}`); toast.success("Viewer link copied!") }} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-black uppercase transition-colors shrink-0 cursor-pointer text-white">Copy Link</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BOOSTER TAB */}
                {activeTab === "BOOSTER" && (
                    <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col gap-6 p-4 z-10 relative">
                        {/* Booster Settings Summary */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col gap-4">
                            <h2 className="text-xl font-black uppercase tracking-widest text-[#FFD500] drop-shadow-md">Booster Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Booster Enabled</span>
                                    <span className="font-bold text-lg mt-1 text-white">{settings?.isBoosterEnabled ? "YES" : "NO"}</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins">Booster Amount</span>
                                    <span className="font-bold text-lg mt-1 ">₹{(settings?.boosterAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest font-poppins font-poppins font-poppins">Booster Trigger</span>
                                    <span className="font-bold text-lg mt-1 text-yellow-400 font-poppins">Every {settings?.boosterTrigger || 10} Players Bought</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Boosters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                            {teams.map((t: any) => (
                                <div key={t.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col justify-between group relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center p-1 shrink-0">
                                            {t.logo ? <img src={t.logo} className="w-full h-full object-contain" /> : <div className="text-xs font-bold text-white/50">{t.shortName}</div>}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-black text-base uppercase leading-tight truncate" title={t.name}>{t.name}</h3>
                                            <span className="text-gray-400 font-bold text-xs mt-1">Purse: ₹{(t.purse || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white/40">Boosters Used:</span>
                                            <span className="text-white font-black">{t.boostersUsed || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white/40 font-poppins">Players Bought:</span>
                                            <span className="text-white font-black">{t.playersCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white/40 font-poppins">Next Trigger:</span>
                                            <span>
                                                {Math.ceil(((t.playersCount || 0) + 1) / (settings?.boosterTrigger || 10)) * (settings?.boosterTrigger || 10)} Players
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-white/30 text-center font-bold uppercase tracking-wider mt-2 border border-white/5 bg-white/5 py-2 rounded-xl">
                                        Automated Booster Mode
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            {/* Bottom Action Footer - UPDATED with better spacing, tooltips, and sizing */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#0a0a14]/95 backdrop-blur-2xl border-t border-white/10 px-6 flex items-center justify-between z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                {/* Left side actions - improved button sizes and spacing */}

                <div className="flex items-center h-full max-w-[80%] overflow-hidden">
                    <div className="flex shrink-0 items-center gap-4 mr-6 border-r border-white/10 pr-6 h-full py-2">
                        {status === "BIDDING" ? (
                            <>
                                <button onClick={handleSoldClick} className="px-6 py-3 bg-green-600 hover:bg-green-500 cursor-pointer rounded-xl text-xs font-black uppercase text-white shadow-lg active:scale-95 transition-all font-poppins">
                                    Sold
                                </button>
                                <button onClick={handleUnsoldClick} className="px-6 py-3 bg-red-600 hover:bg-red-500 cursor-pointer rounded-xl text-xs font-black uppercase text-white shadow-lg active:scale-95 transition-all font-poppins">
                                    Unsold
                                </button>
                                <button onClick={undoLastBid} className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 cursor-pointer rounded-xl text-xs font-black uppercase shadow-lg transition-transform active:scale-95 font-poppins">
                                    Undo Bid
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => selectPlayer('SEQUENCE')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 cursor-pointer rounded-xl text-xs font-black uppercase text-white shadow-lg active:scale-95 transition-all font-poppins">
                                    New Player
                                </button>
                                {currentPlayer && (
                                    <button onClick={undoLastBid} className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 cursor-pointer rounded-xl text-xs font-black uppercase shadow-lg transition-transform active:scale-95 font-poppins">
                                        Undo Action
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Middle: Team bidding buttons - fixed tooltip positioning */}
                    <div className="flex justify-center items-center h-full flex-1 overflow-x-auto overflow-y-visible custom-scrollbar px-2">
                        <div className="flex items-center gap-4">
                            {teams.map(t => (
                                <div key={t.id} className="relative inline-block group">
                                    <button
                                        onClick={() => placeBid(t.id)}
                                        className="shrink-0 w-14 h-14 rounded-full border-2 border-white/10 hover:border-green-400 hover:scale-105 bg-white/5 overflow-hidden transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer"
                                        title={`Bid for ${t.name} (₹${t.purse?.toLocaleString()} left)`}
                                    >
                                        {t.logo ? (
                                            <img src={t.logo} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <span className="text-xs font-black text-white/70">{t.shortName || t.name?.substring(0, 2) || "TM"}</span>
                                        )}
                                    </button>
                                    {/* Styled tooltip - much higher offset to clear bottom bar */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-6 mb-24 px-3 py-1.5 bg-black/90 backdrop-blur-md text-white text-xs font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] shadow-lg border border-white/20">
                                        {t.name}<br />
                                        <span className="text-green-400">₹{t.purse?.toLocaleString()}</span> left
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side Menu & Fullscreen */}
                <div className="flex items-center gap-4 shrink-0 pl-6 border-l border-white/10">
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-black uppercase transition-colors text-white/80 cursor-pointer">
                            <Menu size={16} /> Menu
                        </button>
                        <div className="absolute bottom-full right-0 mb-4 w-56 bg-[#11111a] border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] rounded-2xl flex flex-col overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-bottom-right z-[100]">
                            <button onClick={() => { navigator.clipboard.writeText(`${pageOrigin}/overlay/${auctionId}`); toast.success("Overlay link copied!"); }} className="px-6 py-4 text-left hover:bg-white/5 text-xs font-black uppercase text-white tracking-widest border-b border-white/5 transition-colors cursor-pointer font-poppins">Overlay Link</button>
                            <button onClick={() => setActiveTab("BOOSTER")} className="px-6 py-4 text-left hover:bg-white/5 text-xs font-black uppercase text-yellow-400 tracking-widest border-b border-white/5 transition-colors cursor-pointer font-poppins">Booster</button>
                            <button onClick={() => setShowWheel(true)} className="px-6 py-4 text-left hover:bg-white/5 text-xs font-black uppercase text-blue-400 tracking-widest transition-colors cursor-pointer font-poppins">Fortune Wheel</button>
                        </div>
                    </div>
                    <button onClick={() => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    }} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors text-white/80 cursor-pointer">
                        <Maximize size={14} /> Fullscreen
                    </button>
                </div>
            </div>

            {/* Modal for Team Details - FIXED: now displays players correctly */}
            <AnimatePresence>
                {selectedTeam && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#11111a] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center p-2 border border-white/10">
                                        {selectedTeam.logo ? <img src={selectedTeam.logo} className="w-full h-full object-contain" /> : <div className="text-sm font-bold text-white/50">{selectedTeam.shortName}</div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-black uppercase tracking-widest">{selectedTeam.name} - Roster</h2>
                                        <p className="text-xs font-bold text-[#34D399] uppercase">Remaining: ₹{selectedTeam.purse?.toLocaleString()} • Players: {selectedTeam.playersCount || 0}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTeam(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"><XCircle size={24} className="text-white/50" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 custom-scrollbar bg-black/20">
                                {(() => {
                                    const soldPlayers = dashboardSnapshot?.players?.sold || [];
                                    // Match by teamName (e.g., "Royal Challengers Bangalore") instead of teamId
                                    const teamPlayers = soldPlayers.filter((p: any) => p.teamName === selectedTeam.name);
                                    if (teamPlayers.length === 0) {
                                        return <div className="col-span-full text-center text-white/40 text-sm font-bold py-12">No players sold to this team yet</div>;
                                    }
                                    return teamPlayers.map((player: any) => (
                                        <div key={player.id} className="col-span-1 lg:col-span-2 xl:col-span-5 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                                <img src={player.profilePic || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt={player.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white font-bold text-xs sm:text-sm truncate uppercase">{player.name}</div>
                                                <div className="text-white/40 text-[10px]">{player.role || "Player"}</div>
                                            </div>
                                            <div className="text-right text-[#34D399] font-black text-xs sm:text-sm">₹{player.soldPrice?.toLocaleString() || 0}</div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fortune Wheel Modal */}
            <AnimatePresence>
                {showWheel && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#11111a] border border-white/10 rounded-3xl w-full max-w-4xl p-6 flex flex-col md:flex-row gap-8 shadow-[0_20px_100px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">

                            {/* Left Side: Spinner */}
                            <div className="flex-1 flex flex-col items-center justify-center relative">
                                <h3 className="text-lg font-black uppercase tracking-widest text-[#FFD500] mb-4">Fortune Spinner</h3>

                                {selectedTeamsForWheel.length > 0 ? (
                                    <div className="relative w-[300px] h-[300px] flex items-center justify-center overflow-visible">
                                        {/* Wheel SVG */}
                                        <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                                            <g style={{ transform: `rotate(${wheelRotation}deg)`, transformOrigin: '150px 150px', transition: isWheelSpinning ? 'transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'transform 0.5s ease-out' }}>
                                                {/* Outer Wheel background shadow */}
                                                <circle cx="150" cy="150" r="142" fill="#1e1e2f" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                                                {/* Draw slices */}
                                                {selectedTeamsForWheel.map((teamId, i) => {
                                                    const N = selectedTeamsForWheel.length;
                                                    const startAngle = i * (360 / N);
                                                    const endAngle = (i + 1) * (360 / N);
                                                    const midAngle = startAngle + (180 / N);
                                                    const team = teams.find(t => t.id === teamId);
                                                    if (!team) return null;

                                                    const sliceColor = `hsl(${(i * 360) / N}, 70%, 45%)`;
                                                    const textPos = polarToCartesian(150, 150, 85, midAngle);

                                                    return (
                                                        <g key={teamId}>
                                                            <path d={describeArc(150, 150, 140, startAngle, endAngle)} fill={sliceColor} stroke="#111" strokeWidth="2" />
                                                            <text
                                                                x={textPos.x}
                                                                y={textPos.y}
                                                                fill="#fff"
                                                                fontSize="10"
                                                                fontWeight="900"
                                                                textAnchor="middle"
                                                                transform={`rotate(${midAngle + 180}, ${textPos.x}, ${textPos.y})`}
                                                            >
                                                                {team.shortName || team.name?.substring(0, 3) || "TM"}
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                                {/* Inner hub */}
                                                <circle cx="150" cy="150" r="25" fill="#111" stroke="#FFD500" strokeWidth="3" />
                                                <circle cx="150" cy="150" r="5" fill="#FFD500" />
                                            </g>

                                            {/* Static Pointer pointing down at top center */}
                                            <polygon points="140,2 160,2 150,22" fill="#FFD500" stroke="#111" strokeWidth="2" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-[300px] h-[300px] border-4 border-dashed border-white/10 rounded-full flex items-center justify-center text-center text-white/30 text-xs font-bold p-6">
                                        Select at least 1 team to construct the wheel
                                    </div>
                                )}

                                <button
                                    disabled={isWheelSpinning || selectedTeamsForWheel.length === 0}
                                    onClick={spinWheel}
                                    className="flex justify-center items-center gap-2 mt-6 px-10 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 disabled:opacity-40 text-[#012972] font-black text-sm uppercase rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer font-poppins"
                                >
                                    {isWheelSpinning ? "Spinning..." : <><RotateCcw strokeWidth={2} /> Spin Wheel</>}
                                </button>
                            </div>

                            {/* Right Side: Participating Teams Selection */}
                            <div className="w-full md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                                <div>
                                    <div className="flex justify-between items-center mb-4 font-poppins">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white/70 font-poppins">Participating Teams</h3>
                                        <button
                                            onClick={() => setShowWheel(false)}
                                            className="p-1 hover:bg-white/5 rounded-lg text-white/50 hover:text-white cursor-pointer font-poppins"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                        {teams.map(t => {
                                            const isSelected = selectedTeamsForWheel.includes(t.id);
                                            return (
                                                <label key={t.id} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer select-none transition-all">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        disabled={isWheelSpinning}
                                                        onChange={() => {
                                                            setSelectedTeamsForWheel(prev =>
                                                                isSelected ? prev.filter(id => id !== t.id) : [...prev, t.id]
                                                            );
                                                        }}
                                                        className="w-4 h-4 rounded border-white/20 bg-black text-yellow-500 accent-yellow-500 focus:ring-0 cursor-pointer"
                                                    />
                                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center p-0.5">
                                                        {t.logo ? <img src={t.logo} className="w-full h-full object-contain" /> : <span className="text-[8px] font-bold">{t.shortName}</span>}
                                                    </div>
                                                    <span className="text-xs font-bold text-white/80 uppercase truncate">{t.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Spin Result & Assign Confirmation */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    {showWinnerConfirm && wheelWinner && currentPlayer && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex flex-col gap-4 animate-fade-in">
                                            <div className="text-center">
                                                <div className="text-[10px] text-white/40 font-black uppercase tracking-widest font-poppins">Spin Outcome</div>
                                                <div className="text-yellow-400 font-black text-base uppercase mt-1 font-poppins">{wheelWinner.name}</div>
                                                <div className="text-[10px] text-white/70 font-medium mt-2 font-poppins">
                                                    Assign <span className="text-white font-bold">{currentPlayer.name}</span> to roster at base price ₹{currentPlayer.basePrice?.toLocaleString()}?
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (socketRef.current) {
                                                        socketRef.current.emit("assign_unsold_to_team", {
                                                            auctionId,
                                                            playerId: currentPlayer.id,
                                                            teamId: wheelWinner.id
                                                        });
                                                        setShowWheel(false);
                                                        toast.success(`Assigned ${currentPlayer.name} to ${wheelWinner.name}!`);
                                                    }
                                                }}
                                                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase rounded-xl transition-all active:scale-95 shadow-md text-center cursor-pointer font-poppins"
                                            >
                                                Confirm Assignment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop View Recommendation Modal */}
            <AnimatePresence>
                {showDesktopWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="w-full max-w-md rounded-2xl bg-[#11111a] border border-white/10 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                {/* Glowing Icon Container */}
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FFBA00]/20 to-[#FFBA00]/5 flex items-center justify-center mb-5 border border-[#FFBA00]/30 shadow-[0_0_20px_rgba(255,186,0,0.15)]">
                                    <Monitor className="h-8 w-8 text-[#FFBA00] animate-pulse" />
                                </div>

                                <h3 className="text-xl font-bold text-white font-epilogue tracking-wide mb-3">
                                    Desktop View Recommended
                                </h3>

                                <p className="text-white/60 text-sm leading-relaxed mb-6 font-poppins">
                                    For the best cricket auction experience, we highly recommend accessing this page on a <span className="text-[#FFBA00] font-semibold">desktop or laptop</span>.
                                    Real-time player bidding grids, layouts, and live details are optimized specifically for larger screens.
                                </p>

                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            isNavigatingAway.current = true;
                                            setShowDesktopWarning(false);
                                            router.push("/dashboard/organizer");
                                        }}
                                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#012972] font-black py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer text-sm font-poppins"
                                    >
                                        Return to Mobile Dashboard
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screen Flash Strobe Overlay */}
            <AnimatePresence>
                {isSold && soldEffect === "flash" && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="fixed inset-0 bg-white z-[9999] pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
                .mask-linear-fade { mask-image: linear-gradient(to right, black 80%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); }
                `
            }} />
        </div>
    );
};