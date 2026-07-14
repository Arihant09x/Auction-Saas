"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import confetti from "canvas-confetti";


// ─── Types ───────────────────────────────────────────────────────────────────
interface PlayerData {
    id: string; name: string; role?: string; age?: number | string; profilePic?: string;
    battingStyle?: string; bowlingStyle?: string; status?: string;
    category?: { name: string; color?: string }; baseBid?: number | string;
    basePrice?: number | string; soldPrice?: number | string;
    teamName?: string; team?: { name: string } | null; city?: string;
    score?: number; avgScore?: number;
    season?: string; experience?: string; style?: string; type?: string;
    jerseyNumber?: number;
    details?: Record<string, unknown>;
}
interface TeamData {
    id: string; name: string; shortName?: string; logo?: string;
    originalPurse?: number | string; purseSpent?: number | string;
    playersCount?: number | string; maxPlayers?: number | string;
    purseLeft?: number | string;
}
interface CategoryData {
    id: string; name: string; color?: string;
    auctionId?: string; baseBid?: string; minIncrement?: string;
    maxPlayersPerTeam?: number; minPlayersPerTeam?: number | null;
}
interface SnapshotData {
    auctionId: string;
    logo?: string | null;
    teams: TeamData[];
    players: { upcoming: PlayerData[]; unsold: PlayerData[]; sold: PlayerData[] };
    categories?: CategoryData[];
}

// Helper: backend sends team name as either `teamName` or `team.name`
function getPlayerTeamName(p: PlayerData): string {
    return p.teamName || p.team?.name || "";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(n: number | string | undefined): string {
    const num = Number(n) || 0;
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("en-IN");
}

// ─── Framer Motion Variants ──────────────────────────────────────────────────
const cardEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.04, duration: 0.35, ease: cardEase },
    }),
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.58, 1] as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const bidPulse = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.08, 1], transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const } },
};

// ─── TanStack Query keys ─────────────────────────────────────────────────────
const SNAPSHOT_KEY = (auctionId: string) => ["viewer-snapshot", auctionId] as const;

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ViewerLiveAuctionPage() {
    const params = useParams();
    const auctionId = params.auctionId as string;
    const socketRef = useRef<Socket | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const queryClient = useQueryClient();
    const fallbackImage = "/icon1.png";

    // GSAP refs
    const headerRef = useRef<HTMLElement>(null);
    const bidAmountRef = useRef<HTMLSpanElement>(null);

    // ─── State ───────────────────────────────────────────────────────────────
    const [connected, setConnected] = useState(false);
    const [banner, setBanner] = useState("Connecting...");
    const [bidTimer, setBidTimer] = useState<string>("");

    // Countdown state
    const [isCountdown, setIsCountdown] = useState(false);
    const [auctionLogo, setAuctionLogo] = useState<string | null>(null);
    const [countdownData, setCountdownData] = useState<{
        auctionName: string;
        date: string;
        day: string;
        time: string;
        location?: string;
        sport?: string;
    } | null>(null);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Live player state
    const [currentPlayer, setCurrentPlayer] = useState<PlayerData | null>(null);
    const [currentBid, setCurrentBid] = useState(0);
    const [nextBid, setNextBid] = useState(0);
    const [biddingTeam, setBiddingTeam] = useState("");
    const [soldOverlay, setSoldOverlay] = useState<string | null>(null);
    const [unsoldOverlay, setUnsoldOverlay] = useState(false);

    // Customization states
    const [soldEffect, setSoldEffect] = useState("confetti-center");



    const triggerConfetti = useCallback((effect: string) => {
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
    }, []);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // UI state
    const [activeTab, setActiveTab] = useState<"TEAMS" | "PLAYERS">("TEAMS");
    const [playerFilter, setPlayerFilter] = useState<"ALL" | "SOLD" | "UNSOLD" | "UPCOMING">("ALL");
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>("default");
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [soldPrice, setSoldPrice] = useState<number | null>(null);
    const [winningTeam, setWinningTeam] = useState<string | null>(null);

    // Team drill-down state
    const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

    // ─── TanStack Query for cached snapshot ──────────────────────────────────
    const { data: snapshot } = useQuery<SnapshotData | null>({
        queryKey: SNAPSHOT_KEY(auctionId),
        queryFn: () => null,
        initialData: null,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });

    // Derived data from cached snapshot
    const teams = useMemo(() => snapshot?.teams || [], [snapshot]);
    const players = useMemo(() => snapshot?.players || { upcoming: [], unsold: [], sold: [] }, [snapshot]);
    const teamsCache = useRef<TeamData[]>([]);

    // Keep teamsCache ref synced
    useEffect(() => { teamsCache.current = teams; }, [teams]);

    const leadingTeam = useMemo(() => {
        return teams.find(t => t.name === biddingTeam);
    }, [teams, biddingTeam]);

    const statsItems = useMemo(() => {
        if (!currentPlayer) return [];
        return [
            { label: "Category", val: currentPlayer.category?.name },
            { label: "Age", val: currentPlayer.age },
            { label: "Style", val: currentPlayer.battingStyle || currentPlayer.bowlingStyle || (currentPlayer as any).style },
            { label: "Type", val: currentPlayer.role ? currentPlayer.role.replace(/_/g, " ").replace("BATTING ", "").replace("BOWLING ", "").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) : (currentPlayer as any).type },
            { label: "Score", val: currentPlayer.score || (currentPlayer.details as any)?.score || currentPlayer.jerseyNumber },
            { label: "Avg. Score", val: currentPlayer.avgScore || (currentPlayer.details as any)?.avgScore },
            { label: "Season", val: currentPlayer.season || (currentPlayer.details as any)?.season },
            { label: "Experience", val: currentPlayer.experience || (currentPlayer.details as any)?.experience },
        ].filter(item => {
            if (item.val === undefined || item.val === null || item.val === "") return false;
            const strVal = String(item.val).trim().toLowerCase();
            return strVal !== "n/a" && strVal !== "-" && strVal !== "--" && strVal !== "null" && strVal !== "undefined";
        });
    }, [currentPlayer]);

    // ─── GSAP header entrance ───────────────────────────────────────────────
    useLayoutEffect(() => {
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
            );
        }
    }, []);

    // ─── GSAP bid amount pop on change ──────────────────────────────────────
    useEffect(() => {
        if (bidAmountRef.current && currentBid > 0) {
            gsap.fromTo(bidAmountRef.current,
                { scale: 1.3, color: "#00ff88" },
                { scale: 1, color: "#00f2c3", duration: 0.4, ease: "elastic.out(1, 0.5)" }
            );
        }
    }, [currentBid]);

    // ─── Timer helpers ───────────────────────────────────────────────────────
    const startBidTimer = useCallback((timerObj: { startTime: number; duration: number }) => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!timerObj?.startTime || !timerObj?.duration) return;

        const tick = () => {
            const elapsed = Date.now() - timerObj.startTime;
            const remaining = timerObj.duration - elapsed;
            if (remaining <= 0) {
                if (timerRef.current) clearInterval(timerRef.current);
                setBidTimer("TIME'S UP!");
                return;
            }
            setBidTimer(`${Math.ceil(remaining / 1000)}s`);
        };
        tick();
        timerRef.current = setInterval(tick, 1000);
    }, []);

    // ─── Helper to update snapshot in TanStack cache ─────────────────────────
    const updateSnapshotCache = useCallback((updater: (prev: SnapshotData | null) => SnapshotData | null) => {
        queryClient.setQueryData<SnapshotData | null>(SNAPSHOT_KEY(auctionId), (prev) => updater(prev ?? null));
    }, [auctionId, queryClient]);

    // ─── WebSocket connection ────────────────────────────────────────────────
    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
        const socket = io(`${wsUrl}/live-auction`, {
            query: { token: "VIEWER", auctionId },
            reconnection: true,
            transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            setBanner("CONNECTED");
        });

        socket.on("disconnect", () => {
            setConnected(false);
            setBanner("RECONNECTING...");
        });

        const handleSnapshot = (data: SnapshotData) => {
            if (data.logo) setAuctionLogo(data.logo);
            updateSnapshotCache(() => ({
                auctionId: data.auctionId || auctionId,
                logo: data.logo,
                teams: data.teams || [],
                players: data.players || { upcoming: [], unsold: [], sold: [] },
                categories: data.categories || [],
            }));
        };
        socket.on("snapshot_sync", handleSnapshot);
        socket.on("dashboard_snapshot", handleSnapshot);

        socket.on("auction_state_update", (data: any) => {
            if (data.logo) setAuctionLogo(data.logo);
            if (data.auctionName) {
                setCountdownData(prev => prev ? {
                    ...prev,
                    auctionName: data.auctionName,
                } : {
                    auctionName: data.auctionName,
                    date: "",
                    day: "",
                    time: "",
                });
            }
            if (data.status && data.status !== "BIDDING") {
                setBanner(`STATUS: ${data.status}`);
            }
            if (Array.isArray(data.teams) && data.teams.length > 0) {
                updateSnapshotCache(prev => {
                    if (!prev) return prev;
                    const updatedTeams = prev.teams.map((t: any) => {
                        const match = data.teams.find((x: any) => x.id === t.id);
                        return match ? { ...t, ...match } : t;
                    });
                    return { ...prev, teams: updatedTeams };
                });
            }
            if (data.settings && data.settings.soldEffect) {
                setSoldEffect(data.settings.soldEffect);
            }

            if (data.currentPlayer) {
                setCurrentPlayer(data.currentPlayer);
                if (data.currentPlayer.status === "SOLD") {
                    setSoldOverlay(`SOLD TO\n${data.currentPlayer.teamName || ""}`);
                    setUnsoldOverlay(false);
                    setBanner("PLAYER SOLD!");
                    setSoldPrice(Number(data.currentPlayer.soldPrice) || null);
                    setWinningTeam(data.currentPlayer.teamName || null);
                } else if (data.currentPlayer.status === "UNSOLD") {
                    setSoldOverlay(null);
                    setUnsoldOverlay(true);
                    setBanner("PLAYER UNSOLD");
                    setSoldPrice(null);
                    setWinningTeam(null);
                } else {
                    setSoldOverlay(null);
                    setUnsoldOverlay(false);
                    setBanner("🔴 LIVE BIDDING");
                    setSoldPrice(null);
                    setWinningTeam(null);
                }
            } else {
                setCurrentPlayer(null);
                setSoldOverlay(null);
                setUnsoldOverlay(false);
                setSoldPrice(null);
                setWinningTeam(null);
            }

            if (data.lastBid) {
                setCurrentBid(Number(data.lastBid.amount) || 0);
                const t = data.teams?.find((x: any) => x.id === data.lastBid.teamId);
                setBiddingTeam(t ? t.name : "None");
            } else {
                setCurrentBid(0);
                setBiddingTeam("Waiting for Bids...");
            }
        });

        socket.on("new_player_revealed", (data: any) => {
            setIsCountdown(false);
            setSoldOverlay(null);
            setUnsoldOverlay(false);
            setSoldPrice(null);
            setWinningTeam(null);
            setCurrentPlayer(data.player);
            setCurrentBid(Number(data.currentBid) || 0);
            setNextBid(Number(data.nextBid) || 0);
            setBiddingTeam("Waiting for Bids...");
            setBanner("🔴 LIVE BIDDING");
            if (data.Timer) startBidTimer(data.Timer);
        });

        socket.on("new_bid_patch", (data: any) => {
            setCurrentBid(Number(data.amount) || 0);
            setNextBid(Number(data.nextBid || data.nextbid) || 0);
            const teamName = data.teamName || teamsCache.current.find(t => t.id === data.teamId)?.name || "Unknown Team";
            setBiddingTeam(teamName);
            if (data.Timer) startBidTimer(data.Timer);
        });

        socket.on("player_sold_confirmed", (data: any) => {
            setSoldOverlay(`SOLD TO\n${data.soldTo || data.teamName}`);
            setUnsoldOverlay(false);
            setSoldPrice(Number(data.amount) || null);
            setWinningTeam(data.soldTo || data.teamName || null);
            if (timerRef.current) clearInterval(timerRef.current);
            setBanner("PLAYER SOLD!");
            setBidTimer("");

            // Play Confetti directly
            triggerConfetti(data.soldEffect || soldEffect);
        });

        socket.on("player_unsold_confirmed", () => {
            setSoldOverlay(null);
            setUnsoldOverlay(true);
            setSoldPrice(null);
            setWinningTeam(null);
            if (timerRef.current) clearInterval(timerRef.current);
            setBanner("PLAYER UNSOLD");
            setBidTimer("");
        });

        socket.on("player_unsold_patch", (unsoldPlayer: any) => {
            updateSnapshotCache(prev => {
                if (!prev) return prev;
                const mapped = { ...unsoldPlayer, status: "UNSOLD" };
                return {
                    ...prev,
                    players: {
                        ...prev.players,
                        unsold: [...prev.players.unsold, mapped],
                        upcoming: prev.players.upcoming.filter(p => p.id !== unsoldPlayer.id),
                        sold: prev.players.sold.filter(p => p.id !== unsoldPlayer.id),
                    }
                };
            });
        });

        socket.on("player_reauction_patch", ({ ids }: { ids: string[] }) => {
            updateSnapshotCache(prev => {
                if (!prev) return prev;
                const moving = prev.players.unsold.filter(p => ids.includes(p.id)).map(p => ({ ...p, status: "UPCOMING" }));
                return {
                    ...prev,
                    players: {
                        ...prev.players,
                        unsold: prev.players.unsold.filter(p => !ids.includes(p.id)),
                        upcoming: [...prev.players.upcoming, ...moving],
                    }
                };
            });
        });

        socket.on("bid_undone", (data: any) => {
            setIsCountdown(false);
            setSoldOverlay(null);
            setUnsoldOverlay(false);
            setSoldPrice(null);
            setWinningTeam(null);
            setBanner("🔴 LIVE BIDDING");

            if (data.lastBid) {
                setCurrentBid(Number(data.lastBid.amount) || 0);
                const t = teamsCache.current.find(x => x.id === data.lastBid.teamId);
                setBiddingTeam(t ? t.name : "None");
                setNextBid(Number(data.nextBid || data.nextbid) || 0);
            } else {
                setCurrentBid(0);
                setBiddingTeam("Waiting for Bids...");
                setNextBid(0);
            }

            setCurrentPlayer((prev) => prev ? {
                ...prev,
                status: "UPCOMING",
                soldPrice: undefined,
                teamName: undefined,
                team: null,
            } : null);
        });

        socket.on("auction_countdown", (data: any) => {
            setIsCountdown(true);
            const datePart = data.scheduledDate?.split("T")[0] || "";
            const [year, month, day] = datePart.split("-").map(Number);

            let h = 0, m = 0;
            if (data.scheduledStartTime) {
                const [time, modifier] = data.scheduledStartTime.trim().split(" ");
                const parts = time.split(":");
                h = parseInt(parts[0], 10);
                m = parseInt(parts[1], 10);
                if (modifier?.toUpperCase() === "PM" && h < 12) h += 12;
                if (modifier?.toUpperCase() === "AM" && h === 12) h = 0;
            }

            const target = new Date(year, month - 1, day, h, m, 0, 0);
            const dateObj = new Date(year, month - 1, day);
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
            const dateStr = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

            setAuctionLogo(data.logo);
            setCountdownData({
                auctionName: data.auctionName || "Auction",
                date: dateStr,
                day: dayName,
                time: data.scheduledStartTime || "TBD",
                location: data.location || null,
                sport: data.sport || null,
            });

            if (countdownRef.current) clearInterval(countdownRef.current);
            countdownRef.current = setInterval(() => {
                const diff = target.getTime() - Date.now();
                if (diff <= 0) {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    setBanner("AUCTION STARTING NOW!");
                    return;
                }
                setCountdown({
                    days: Math.floor(diff / 86400000),
                    hours: Math.floor((diff % 86400000) / 3600000),
                    minutes: Math.floor((diff % 3600000) / 60000),
                    seconds: Math.floor((diff % 60000) / 1000),
                });
            }, 1000);
        });

        socket.on("auction_ended", () => {
            setAuctionEnded(true);
            setBanner("AUCTION ENDED");
            if (timerRef.current) clearInterval(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        });

        socket.on("player_sold_patch", (soldPlayer: any) => {
            updateSnapshotCache(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    players: {
                        ...prev.players,
                        sold: [...prev.players.sold, soldPlayer],
                        upcoming: prev.players.upcoming.filter(p => p.id !== soldPlayer.id),
                        unsold: prev.players.unsold.filter(p => p.id !== soldPlayer.id),
                    }
                };
            });
        });

        socket.on("team_updated_patch", (data: any) => {
            updateSnapshotCache(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    teams: prev.teams.map(t =>
                        t.id === data.id ? { ...t, purseSpent: data.purse !== undefined ? String(Number(t.originalPurse || 0) - Number(data.purse)) : t.purseSpent, playersCount: data.playersCount ?? t.playersCount } : t
                    ),
                };
            });
        });

        return () => {
            socket.disconnect();
            if (timerRef.current) clearInterval(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [auctionId, startBidTimer, updateSnapshotCache]);

    // ─── Filtered + searched data ────────────────────────────────────────────
    const filteredTeams = useMemo(() => {
        if (!searchQuery.trim() || activeTab !== "TEAMS") return teams;
        const q = searchQuery.toLowerCase();
        return teams.filter(t =>
            t.name.toLowerCase().includes(q) ||
            (t.shortName || "").toLowerCase().includes(q)
        );
    }, [teams, searchQuery, activeTab]);

    const filteredPlayers = useMemo(() => {
        let list: PlayerData[] = [];
        if (playerFilter === "ALL") list = [...players.upcoming, ...players.unsold, ...players.sold];
        else if (playerFilter === "SOLD") list = players.sold;
        else if (playerFilter === "UNSOLD") list = players.unsold;
        else if (playerFilter === "UPCOMING") list = [...players.upcoming];

        if (searchQuery.trim() && activeTab === "PLAYERS") {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.battingStyle || "").toLowerCase().includes(q) ||
                (p.role || "").toLowerCase().includes(q) ||
                (p.category?.name || "").toLowerCase().includes(q) ||
                getPlayerTeamName(p).toLowerCase().includes(q)
            );
        }

        if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === "category") list.sort((a, b) => (a.category?.name || "").localeCompare(b.category?.name || ""));
        return list;
    }, [playerFilter, players, sortBy, searchQuery, activeTab]);

    const soldCount = players.sold.length;
    const unsoldCount = players.unsold.length;
    const availCount = players.upcoming.length;

    const teamRoster = useMemo(() => {
        if (!selectedTeam) return [];
        return players.sold.filter(p => {
            const pTeam = getPlayerTeamName(p).toLowerCase();
            return pTeam === selectedTeam.name.toLowerCase();
        });
    }, [selectedTeam, players.sold]);

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div className="h-screen flex flex-col overflow-hidden font-epilogue" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute hidden sm:block" style={{ width: "clamp(80px, 10vw, 140px)", height: "200vh", background: "linear-gradient(80deg, #08245E, #0A307F)", transform: "rotate(18deg)", left: "70%", top: "-20%" }} />
                <div className="absolute hidden sm:block" style={{ width: "clamp(80px, 10vw, 140px)", height: "200vh", background: "#0A307F", transform: "rotate(18deg)", left: "63%", top: "-20%", filter: "drop-shadow(0 4px 20px #000)" }} />
            </div>

            <div className="relative z-10 flex flex-col h-full w-full max-w-[1440px] mx-auto overflow-hidden">
                <div className="flex-none px-3 sm:px-5 pt-3 sm:pt-3 pb-4 flex flex-col gap-2 z-[60] bg-[#072460] shadow-2xl relative border-b border-white/5">
                    <motion.header ref={headerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-[#0b1f4d] rounded-lg shadow-xl flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 relative border border-white/5 overflow-hidden">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 overflow-hidden">
                            {auctionLogo ? (
                                <img src={auctionLogo} alt="App Logo" className="w-10 h-10 sm:w-20 sm:h-20 object-contain filter drop-shadow-lg flex-shrink-0" />
                            ) : (
                                <div className="w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0D347F] to-[#072460] rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img src={fallbackImage} alt="App Logo" className="w-10 h-10 sm:w-20 sm:h-20 object-contain filter drop-shadow-lg flex-shrink-0" />
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <h1 className="text-white font-bold text-base sm:text-xl md:text-2xl uppercase tracking-tight truncate font-epilogue drop-shadow-sm">
                                    {countdownData?.auctionName || "LIVE AUCTION"}
                                </h1>
                                <span className="text-[#FFD500] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-60">Viewers Live Bidding Screen</span>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="hidden sm:flex flex-col items-end gap-1">
                                {bidTimer && (
                                    <div className="text-[#FFD500] font-black text-xs uppercase tracking-widest tabular-nums">
                                        Time: {bidTimer}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-500 animate-pulse"}`} />
                                    <span className="text-white text-[9px] font-bold uppercase">{connected ? "Connected" : "Reconnecting"}</span>
                                </div>
                            </div>

                            {/* Auction Logo */}
                            {auctionLogo && (
                                <Link href={process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}>
                                    <div className="w-10 h-10 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
                                        <img src="/icon2.png" alt="Auction Logo" className="w-full h-full object-contain p-0.5 cursor-pointer" />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </motion.header>

                    <AnimatePresence mode="wait">
                        {isCountdown ? (
                            <motion.section key="countdown" variants={sectionVariants} initial="hidden" animate="visible" exit="exit"
                                className="bg-[rgba(4,13,39,0.5)] backdrop-blur-sm rounded-lg shadow-lg flex flex-col items-center gap-8 sm:gap-10 p-3 sm:p-7 border border-white/5">
                                <h2 className="text-white/80 font-bold text-[10px] sm:text-sm uppercase tracking-widest text-center">AUCTION STARTS IN</h2>

                                <div className="bg-white/5 rounded-xl p-2 sm:p-4 flex items-center justify-center gap-2 sm:gap-5 border border-white/5">
                                    {[
                                        { val: countdown.days, label: "Days" },
                                        { val: countdown.hours, label: "Hours" },
                                        { val: countdown.minutes, label: "Mins" },
                                        { val: countdown.seconds, label: "Secs" },
                                    ].map((unit, i) => (
                                        <div key={unit.label} className="flex items-center gap-1.5 sm:gap-5">
                                            {i > 0 && <span className="text-white/20 text-lg sm:text-3xl font-light">:</span>}
                                            <div className="flex flex-col items-center min-w-[32px] sm:min-w-[55px]">
                                                <motion.div key={unit.val} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                                    className="text-white font-bold text-xl sm:text-4xl tabular-nums">
                                                    {String(unit.val).padStart(2, "0")}
                                                </motion.div>
                                                <span className="text-white/40 text-[7px] sm:text-[9px] font-bold mt-0.5 uppercase tracking-tighter">{unit.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {countdownData && (
                                    <div className="flex flex-row items-center gap-4 sm:gap-10 w-full justify-center pt-2 sm:pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Date:</span>
                                            <span className="text-white font-semibold text-[10px] sm:text-xs">{countdownData.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Day:</span>
                                            <span className="text-[#FFD500] font-bold text-[10px] sm:text-xs uppercase">{countdownData.day}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Starts:</span>
                                            <span className="text-white font-semibold text-[10px] sm:text-xs">{countdownData.time}</span>
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        ) : currentPlayer ? (
                            <motion.section key="bidding" variants={sectionVariants} initial="hidden" animate="visible" exit="exit"
                                className="bg-[#0b1f4d] rounded-xl shadow-lg p-3 sm:p-5 relative overflow-hidden border border-white/10">

                                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-center w-full">
                                    {/* Player Profile Details (Col 1 - span 3) */}
                                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                                        className="flex items-center gap-4 flex-shrink-0 w-full lg:col-span-3 justify-start">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-[#FFD500] bg-black/30 flex-shrink-0 relative overflow-visible shadow-lg">
                                            <div className="w-full h-full rounded-lg overflow-hidden">
                                                <img src={currentPlayer.profilePic || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt={currentPlayer.name} className="w-full h-full object-cover" />
                                            </div>
                                            <AnimatePresence>
                                                {soldOverlay && (
                                                    <motion.div
                                                        initial={{ scale: 3, opacity: 0, rotate: -45 }}
                                                        animate={{ scale: 1.2, opacity: 1, rotate: -15 }}
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                        className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-16 h-16 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col items-center justify-center"
                                                    >
                                                        <img src="/sold-logo.png" alt="SOLD" className="w-full h-full object-contain animate-[heartbeat_1s_ease-in-out_infinite]" />
                                                        <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 bg-black/90 text-[#FFD500] font-black text-[7px] tracking-widest uppercase px-2 py-0.5 rounded border border-white/20 shadow-xl whitespace-nowrap flex flex-col items-center">
                                                            <span>{winningTeam || biddingTeam || "SOLD"}</span>
                                                            <span className="text-white text-[7px] font-bold">₹{Number(soldPrice || currentBid || 0).toLocaleString()}</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            {unsoldOverlay && (
                                                <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-10 h-10 sm:w-12 sm:h-12 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] pointer-events-none">
                                                    <img src="/unsold-logo.png" alt="UNSOLD" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <h2 className="text-white font-black text-base sm:text-lg md:text-xl leading-tight uppercase tracking-tight break-words">{currentPlayer.name}</h2>
                                            <span className="text-[#FFD500] font-bold text-xs sm:text-sm mt-1">Base Price - ₹{(Number(currentPlayer.basePrice || currentPlayer.baseBid || 0)).toLocaleString()}/-</span>
                                        </div>
                                    </motion.div>

                                    {/* Leading Team Info (Col 2 - span 3) */}
                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                                        className="w-full lg:col-span-3 flex justify-center">
                                        <div className="bg-gradient-to-r from-black/55 to-black/35 rounded-2xl px-5 py-3.5 flex items-center gap-4 border border-white/5 w-full max-w-sm shadow-md">
                                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 p-2 shadow-lg backdrop-blur-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {leadingTeam?.logo && leadingTeam.logo !== "" && !leadingTeam.logo.includes("example.com") ? (
                                                    <img src={leadingTeam.logo} alt={biddingTeam} className="w-full h-full object-contain drop-shadow-md" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#FFD500] text-sm font-black bg-gradient-to-br from-[#0D347F] to-[#072460]">
                                                        {leadingTeam?.shortName || biddingTeam?.substring(0, 2).toUpperCase() || "L"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-white/45 text-[9px] font-black uppercase tracking-widest leading-none">Leading Team</span>
                                                <span className="text-[#FFD500] font-black text-md md:text-lg uppercase truncate block w-full mt-1.5 drop-shadow-sm leading-tight">
                                                    {biddingTeam && biddingTeam !== "Waiting for Bids..." ? biddingTeam : "No Bids Yet"}
                                                </span>
                                                <span className="text-white/45 text-[10px] gap-6 font-black uppercase tracking-widest leading-none">{leadingTeam?.shortName}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Current Bid Display (Col 3 - span 3) */}
                                    <motion.div variants={bidPulse} key={currentBid} className="w-full lg:col-span-3 flex justify-center">
                                        <div className="bg-gradient-to-r from-black/55 to-black/35 rounded-2xl px-5 py-3.5 flex flex-col items-center justify-center border border-white/5 w-full max-w-sm shadow-md text-center">
                                            <span className="text-white/45 text-[9px] font-black uppercase tracking-widest leading-none mb-1.5">Current Bid</span>
                                            <span ref={bidAmountRef} className="text-white font-black text-2xl sm:text-3xl tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] leading-tight">
                                                ₹{(currentBid || 0).toLocaleString()}/-
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Additional Details Stats (Col 4 - span 3) */}
                                    <div className="w-full lg:col-span-3 flex flex-col gap-1.5 border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
                                        <div className="text-white/40 text-[9px] font-black uppercase tracking-widest text-center lg:text-left">Additional Details</div>
                                        <div className="grid grid-cols-2 gap-2 w-full">
                                            {statsItems.map((item, index) => (
                                                <div key={index} className="bg-[#072460]/40 border border-white/5 rounded-lg p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
                                                    <span className="text-white/55 text-[9px] font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap">{item.label}</span>
                                                    <span className="text-white font-extrabold text-sm truncate max-w-full" title={String(item.val)}>{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        ) : auctionEnded ? (
                            <motion.section key="ended" variants={sectionVariants} initial="hidden" animate="visible" exit="exit"
                                className="bg-[rgba(4,13,39,0.5)] rounded-lg shadow-2xl flex flex-col items-center gap-2 p-6 border border-white/10">
                                <h2 className="text-[#FFD500] font-black text-xl uppercase tracking-widest">AUCTION COMPLETED</h2>
                            </motion.section>
                        ) : null}
                    </AnimatePresence>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 sm:px-5 pb-6 flex flex-col gap-3 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        // FIX 1: Added `relative z-50` to the parent container so the dropdown can escape the stacking context
                        className="sticky top-0 z-[50] py-2">
                        <div className="relative z-50 bg-black/[0.27] backdrop-blur-sm rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Tab toggle */}
                                <div className="bg-white rounded-full border-4 border-[#ffffff] flex overflow-hidden hover:bg-gray-200 ">
                                    <button onClick={() => { setActiveTab("TEAMS"); setSearchQuery(""); }}
                                        className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${activeTab === "TEAMS" ? "bg-[#012972] text-white" : "text-[#012972]"}`}
                                    >TEAMS</button>
                                    <button onClick={() => { setActiveTab("PLAYERS"); setSearchQuery(""); }}
                                        className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${activeTab === "PLAYERS" ? "bg-[#012972] text-white" : "text-[#012972]"}`}
                                    >PLAYERS</button>
                                </div>

                                {/* Search bar */}
                                <div className="relative flex-1 min-w-[140px] max-w-[260px]">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder={activeTab === "TEAMS" ? "Search teams..." : "Search players..."}
                                        className="w-full bg-white/10 border border-white/15 text-white text-xs sm:text-sm rounded-full pl-9 pr-3 py-1.5 placeholder:text-white/40 focus:outline-none focus:border-[#FFD500]/50 focus:bg-white/15 transition-colors"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 text-xs">✕</button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                {/* Player status filter pills */}
                                {activeTab === "PLAYERS" && (
                                    <div className="bg-white/10 rounded-full flex overflow-hidden border border-white/20">
                                        {(["ALL", "SOLD", "UNSOLD", "UPCOMING"] as const).map(f => (
                                            <button key={f} onClick={() => setPlayerFilter(f)}
                                                className={`px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold transition-colors ${playerFilter === f ? "bg-[#012972] text-white" : "text-white/80 hover:bg-white/5"}`}
                                            >
                                                {f === "ALL" ? "All" : f === "SOLD" ? `Sold : ${String(soldCount).padStart(2, "0")}` : f === "UNSOLD" ? `Unsold : ${String(unsoldCount).padStart(2, "0")}` : `Avl : ${String(availCount).padStart(2, "0")}`}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Sort dropdown */}
                                {activeTab === "PLAYERS" && (
                                    <div className="relative">
                                        <button onClick={() => setSortOpen(!sortOpen)}
                                            className="bg-white rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold text-[#012972] flex items-center gap-2 border border-white/20 min-w-[120px] justify-between">
                                            Sort By
                                            <svg className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                        </button>
                                        <AnimatePresence>
                                            {sortOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-[9998]" onClick={() => setSortOpen(false)} />
                                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                                                        // FIX 2: Replaced invalid `z-9999` with Tailwind standard arbitrary `z-[100]`
                                                        className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[100] min-w-[160px] py-1">
                                                        {[
                                                            { key: "default", label: "Default" },
                                                            { key: "name", label: "By Name" },
                                                            { key: "category", label: "By Category" },
                                                        ].map(opt => (
                                                            <button key={opt.key} onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
                                                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${sortBy === opt.key ? "bg-blue-50 text-[#012972]" : "text-gray-700 hover:bg-gray-50"}`}
                                                            >{opt.label}</button>
                                                        ))}
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeTab === "TEAMS" && (
                            <motion.div key="teams-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                // FIX 3: Changed grid columns so team cards are larger (max 3 across on large screens instead of 5)
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
                                {filteredTeams.map((team, i) => {
                                    const purse = Number(team.originalPurse) || 0;
                                    const spent = Number(team.purseSpent) || 0;
                                    const purseLeft = purse - spent;
                                    return (
                                        <motion.div key={team.id} custom={i} variants={cardVariants} initial="hidden" animate="visible" exit="exit"
                                            whileHover={{ scale: 1.02, borderColor: "rgba(255,213,0,0.4)" }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            onClick={() => setSelectedTeam(team)}
                                            // FIX 4: Increased padding, gap, and rounded corners for larger team cards
                                            className="bg-[#0A2A6E] border border-[#1A3F8A] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 cursor-pointer">

                                            {/* Bigger Logo Container */}
                                            <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden bg-black/30 flex-shrink-0 border border-white/10">
                                                {team.logo && team.logo !== "" && !team.logo.includes("example.com") ? (
                                                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/40 text-2xl font-black bg-gradient-to-br from-[#0D347F] to-[#072460]">
                                                        {team.shortName || team.name?.substring(0, 2).toUpperCase() || "T"}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bigger Text Elements */}
                                            <div className="flex flex-col flex-1 min-w-0 w-full">
                                                <span className="text-[#FFD500] font-extrabold text-sm sm:text-base truncate uppercase mb-1">{team.name}</span>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-white font-black text-2xl sm:text-3xl leading-none">{Number(team.playersCount) || 0}</span>
                                                    <span className="text-white/60 text-xs sm:text-sm font-semibold mb-0.5">Players</span>
                                                </div>
                                                <span className="text-white/50 text-xs font-semibold mt-1">Max Purse: {formatCurrency(purse)}</span>
                                            </div>

                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-1 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                                <div className="flex flex-col items-start sm:items-end">
                                                    <span className="text-white/40 text-[10px] uppercase">Spent</span>
                                                    <span className="text-white/80 text-sm sm:text-base font-bold">{formatCurrency(spent)}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[#FFD500]/60 text-[10px] uppercase">Remaining</span>
                                                    <span className="text-[#FFD500] text-sm sm:text-base font-black">{formatCurrency(purseLeft)}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {filteredTeams.length === 0 && (
                                    <div className="col-span-full text-center text-white/40 py-12 font-semibold">
                                        {searchQuery ? `No teams matching "${searchQuery}"` : "No teams loaded yet."}
                                    </div>
                                )}
                            </motion.div>
                        )}
                        {activeTab === "PLAYERS" && (
                            <motion.div key="players-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                                {filteredPlayers.map((player, idx) => (
                                    <motion.div key={player.id || idx} custom={idx} variants={cardVariants} initial="hidden" animate="visible" exit="exit"
                                        className="bg-[#0A2A6E] border border-[#1A3F8A] rounded-xl p-3 flex flex-col gap-1.5 relative overflow-hidden">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-lg overflow-hidden bg-black/30 flex-shrink-0 border border-white/10">
                                                <img src={player.profilePic || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt={player.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="text-[#FFD500] font-bold text-xs sm:text-sm truncate">{player.name}</span>
                                                <span className="text-white/60 text-[10px] truncate">{player.role || player.battingStyle || "--"}</span>
                                                <span className="text-white/60 text-[10px] truncate">AGE:{player.age || "--"}</span>
                                            </div>
                                        </div>
                                        {player.status === "SOLD" && (
                                            <div className="mt-1 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 flex items-center justify-between">
                                                <span className="text-emerald-400 text-[9px] font-bold truncate">{getPlayerTeamName(player)}</span>
                                                <span className="text-[#FFD500] text-[9px] font-black">₹{formatCurrency(player.soldPrice || 0)}</span>
                                            </div>
                                        )}
                                        {player.status && player.status !== "UPCOMING" && player.status !== "NULL" && (
                                            <div className={`absolute top-1 right-1 text-[8px] font-black px-1 rounded ${player.status === "SOLD" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                                {player.status}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {filteredPlayers.length === 0 && (
                                    <div className="col-span-full text-center text-white/40 py-12 font-semibold">
                                        {searchQuery ? `No players matching "${searchQuery}"` : "No players loaded yet."}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {selectedTeam && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                            onClick={() => setSelectedTeam(null)}>
                            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-[#0A1E4A] border border-[#1A3F8A] rounded-2xl w-full max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/30 flex-shrink-0 border border-white/10">
                                            {selectedTeam.logo && !selectedTeam.logo.includes("example.com") ? (
                                                <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/40 text-sm font-black bg-gradient-to-br from-[#0D347F] to-[#072460]">
                                                    {selectedTeam.shortName || selectedTeam.name?.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-sm sm:text-lg uppercase">{selectedTeam.name}</h3>
                                            <span className="text-[#FFD500] text-[10px] sm:text-xs font-bold">
                                                {teamRoster.length} Players • Spent ₹{formatCurrency(selectedTeam.purseSpent)}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedTeam(null)} className="text-white/40 hover:text-white transition-colors">✕</button>
                                </div>
                                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                                    {teamRoster.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {teamRoster.map((player, idx) => (
                                                <div key={player.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                                        <img src={player.profilePic || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt={player.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[#FFD500] font-black text-xs sm:text-sm truncate uppercase">{player.name}</div>
                                                        <div className="text-white/40 text-[10px]">{player.role || "Player"}</div>
                                                    </div>
                                                    <div className="text-right text-[#00f2c3] font-black text-xs sm:text-sm">₹{formatCurrency(player.soldPrice || 0)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-white/30 py-12 font-bold uppercase text-sm">No players bought yet</div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
                @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&display=swap');
                .font-epilogue { font-family: 'Epilogue', sans-serif; }
                .tabular-nums { font-variant-numeric: tabular-nums; }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.12); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.12); }
                    70% { transform: scale(1); }
                }
                .animate-heartbeat { animation: heartbeat 1s ease-in-out infinite; }
                @media (max-width: 475px) { .xs\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .xs\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
            `}</style>
        </div>
    );
}
