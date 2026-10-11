"use client";

import { useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { posthog } from "@/lib/posthog";

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
    purseLeft?: number | string; purse?: number | string;
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

function getPlayerTeamName(p: PlayerData): string {
    return p.teamName || p.team?.name || "";
}

function formatCurrency(n: number | string | undefined): string {
    const num = Number(n) || 0;
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("en-IN");
}

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

const SNAPSHOT_KEY = (auctionId: string) => ["viewer-snapshot", auctionId] as const;

export default function ViewerLiveAuctionClient({
    auctionId,
    initialData,
}: {
    auctionId: string;
    initialData?: any;
}) {
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const queryClient = useQueryClient();
    const fallbackImage = "/icon1.png";

    // GSAP refs
    const headerRef = useRef<HTMLElement>(null);
    const bidAmountRef = useRef<HTMLSpanElement>(null);

    // Initial derivation from SSR data
    const rawData = initialData?.data ?? initialData;
    const defaultBudget = Number(rawData?.state?.settings?.budgetPerTeam || rawData?.settings?.budgetPerTeam || 10000000);
    const initialSnapshotRaw: SnapshotData | null = rawData?.snapshot || null;
    const initialLiveTeams = rawData?.state?.teams || [];
    const liveTeamsMap = new Map((initialLiveTeams as any[]).map((t: any) => [t.id, t]));

    const initialSnapshot: SnapshotData | null = initialSnapshotRaw ? {
        ...initialSnapshotRaw,
        teams: (initialSnapshotRaw.teams || []).map((t) => {
            const live = liveTeamsMap.get(t.id) as any;
            const original = Number(t.originalPurse || live?.originalPurse || defaultBudget);
            const purse = live?.purse !== undefined
                ? Number(live.purse)
                : (t.purse !== undefined ? Number(t.purse) : (original - Number(t.purseSpent || 0)));
            return {
                ...t,
                originalPurse: original,
                purse,
            };
        })
    } : null;
    const initialStatus: string = rawData?.status || rawData?.state?.status || "WAITING";
    const initialCurrentPlayer: PlayerData | null = rawData?.state?.currentPlayer || null;
    const initialLastBid = rawData?.state?.lastBid;

    // ─── State ───────────────────────────────────────────────────────────────
    const [connected, setConnected] = useState(true);
    const [banner, setBanner] = useState<string>(() => {
        if (initialStatus === "COMPLETED") return "AUCTION ENDED";
        if (initialCurrentPlayer?.status === "SOLD") return "PLAYER SOLD!";
        if (initialCurrentPlayer?.status === "UNSOLD") return "PLAYER UNSOLD";
        if (initialStatus === "WAITING" && !initialCurrentPlayer) return "AUCTION STARTING SOON";
        return "🔴 LIVE BIDDING";
    });

    const [isCountdown, setIsCountdown] = useState<boolean>(initialStatus === "WAITING" && !initialCurrentPlayer);
    const [auctionLogo, setAuctionLogo] = useState<string | null>(rawData?.logo || initialSnapshot?.logo || null);
    const [countdownData, setCountdownData] = useState<{
        auctionName: string;
        date: string;
        day: string;
        time: string;
        location?: string;
        sport?: string;
    } | null>(() => {
        if (!rawData?.auctionDate) return null;
        const d = new Date(rawData.auctionDate);
        return {
            auctionName: rawData.auctionName || "Auction",
            date: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            day: d.toLocaleDateString("en-US", { weekday: "long" }),
            time: rawData.auctionStartTime || "TBD",
            location: rawData.location || null,
            sport: rawData.sportsType || null,
        };
    });
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [currentPlayer, setCurrentPlayer] = useState<PlayerData | null>(initialCurrentPlayer);
    const [currentBid, setCurrentBid] = useState<number>(Number(initialLastBid?.amount) || 0);
    const [nextBid, setNextBid] = useState<number>(0);
    const [biddingTeam, setBiddingTeam] = useState<string>(() => {
        if (!initialLastBid?.teamId) return "Waiting for Bids...";
        const t = initialSnapshot?.teams?.find((x) => x.id === initialLastBid.teamId);
        return t ? t.name : "None";
    });
    const [soldOverlay, setSoldOverlay] = useState<string | null>(() => {
        if (initialCurrentPlayer?.status === "SOLD") {
            const soldToName = initialCurrentPlayer.teamName || (initialCurrentPlayer as any).team?.name || "";
            return `SOLD TO ${soldToName}`;
        }
        return null;
    });
    const [unsoldOverlay, setUnsoldOverlay] = useState<boolean>(initialCurrentPlayer?.status === "UNSOLD");
    const [soldPrice, setSoldPrice] = useState<number | null>(() => {
        if (initialCurrentPlayer?.status === "SOLD") {
            return Number(initialCurrentPlayer.soldPrice) || null;
        }
        return null;
    });
    const [winningTeam, setWinningTeam] = useState<string | null>(() => {
        if (initialCurrentPlayer?.status === "SOLD") {
            return initialCurrentPlayer.teamName || (initialCurrentPlayer as any).team?.name || null;
        }
        return null;
    });

    const [soldEffect, setSoldEffect] = useState(rawData?.settings?.soldEffect || "confetti-center");
    const lastSoldPlayerId = useRef<string | null>(initialCurrentPlayer?.status === "SOLD" ? initialCurrentPlayer.id : null);

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

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"TEAMS" | "PLAYERS">("TEAMS");
    const [playerFilter, setPlayerFilter] = useState<"ALL" | "SOLD" | "UNSOLD" | "UPCOMING">("ALL");
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>("default");
    const [auctionEnded, setAuctionEnded] = useState(initialStatus === "COMPLETED");
    const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

    // ─── TanStack Query for cached snapshot ──────────────────────────────────
    const { data: snapshot } = useQuery<SnapshotData | null>({
        queryKey: SNAPSHOT_KEY(auctionId),
        queryFn: () => initialSnapshot,
        initialData: initialSnapshot,
        staleTime: 5000,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });

    const teams = useMemo(() => snapshot?.teams || [], [snapshot]);
    const players = useMemo(() => snapshot?.players || { upcoming: [], unsold: [], sold: [] }, [snapshot]);
    const teamsCache = useRef<TeamData[]>([]);
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

    useLayoutEffect(() => {
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
            );
        }
    }, []);

    useEffect(() => {
        posthog.capture("viewer_opened", { auction_id: auctionId });
    }, [auctionId]);

    useEffect(() => {
        if (bidAmountRef.current && currentBid > 0) {
            gsap.fromTo(bidAmountRef.current,
                { scale: 1.3, color: "#ffffff" },
                { scale: 1, color: "#ffffff", duration: 0.4, ease: "elastic.out(1, 0.5)" }
            );
        }
    }, [currentBid]);

    const updateSnapshotCache = useCallback((updater: (prev: SnapshotData | null) => SnapshotData | null) => {
        queryClient.setQueryData<SnapshotData | null>(SNAPSHOT_KEY(auctionId), (prev) => updater(prev ?? null));
    }, [auctionId, queryClient]);

    // ─── Polling (Replaces WebSocket with read-only updates) ─────────────────
    const inFlightRef = useRef(false);
    const seqRef = useRef(0);

    const applyLiveState = useCallback((incoming: any) => {
        const data = incoming?.data ?? incoming;
        if (!data) return;

        if (data.logo) setAuctionLogo(data.logo);

        const budget = Number(data.state?.settings?.budgetPerTeam || data.settings?.budgetPerTeam || defaultBudget);

        if (data.snapshot) {
            const stateTeams = data.state?.teams || [];
            const stateTeamsMap = new Map(stateTeams.map((st: any) => [st.id, st]));

            const mergedTeams = (data.snapshot.teams || []).map((t: any) => {
                const live = stateTeamsMap.get(t.id) as any;
                const original = Number(t.originalPurse || live?.originalPurse || budget);
                const purse = live?.purse !== undefined
                    ? Number(live.purse)
                    : (t.purse !== undefined ? Number(t.purse) : (original - Number(t.purseSpent || 0)));
                return {
                    ...t,
                    originalPurse: original,
                    purse,
                };
            });

            updateSnapshotCache(() => ({
                auctionId: data.snapshot.auctionId || auctionId,
                logo: data.snapshot.logo,
                teams: mergedTeams,
                players: data.snapshot.players || { upcoming: [], unsold: [], sold: [] },
                categories: data.snapshot.categories || [],
            }));
        } else if (data.state?.teams) {
            updateSnapshotCache((prev) => {
                if (!prev) return prev;
                const stateTeamsMap = new Map(data.state.teams.map((st: any) => [st.id, st]));
                return {
                    ...prev,
                    teams: prev.teams.map((t: any) => {
                        const live = stateTeamsMap.get(t.id) as any;
                        if (!live) return t;
                        return {
                            ...t,
                            purse: live.purse !== undefined ? Number(live.purse) : t.purse,
                            playersCount: live.playersCount !== undefined ? live.playersCount : t.playersCount,
                        };
                    })
                };
            });
        }

        const state = data.state || {};
        const status = state.status || data.status;

        if (status === "COMPLETED") {
            setAuctionEnded(true);
            setBanner("AUCTION ENDED");
            return;
        }

        const hasActiveOrSoldPlayer = !!state.currentPlayer;

        if (status === "WAITING" && !hasActiveOrSoldPlayer) {
            setIsCountdown(true);
            setBanner("AUCTION STARTING SOON");
            setCurrentPlayer(null);
            setSoldOverlay(null);
            setUnsoldOverlay(false);
            setSoldPrice(null);
            setWinningTeam(null);
            return;
        }

        setIsCountdown(false);

        if (status && status !== "BIDDING") {
            setBanner(`STATUS: ${status}`);
        } else {
            setBanner("🔴 LIVE BIDDING");
        }

        if (data.settings?.soldEffect) {
            setSoldEffect(data.settings.soldEffect);
        }

        // Current player & sold status
        if (state.currentPlayer) {
            setCurrentPlayer(state.currentPlayer);

            if (state.currentPlayer.status === "SOLD") {
                const soldToName = state.currentPlayer.teamName || state.currentPlayer.team?.name || "";
                setSoldOverlay(`SOLD TO\n${soldToName}`);
                setUnsoldOverlay(false);
                setBanner("PLAYER SOLD!");
                setSoldPrice(Number(state.currentPlayer.soldPrice) || null);
                setWinningTeam(soldToName || null);

                // Confetti trigger once per sold player
                if (lastSoldPlayerId.current !== state.currentPlayer.id) {
                    lastSoldPlayerId.current = state.currentPlayer.id;
                    triggerConfetti(data.settings?.soldEffect || soldEffect);
                }
            } else if (state.currentPlayer.status === "UNSOLD") {
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

        // Current & next bid
        if (state.lastBid) {
            setCurrentBid(Number(state.lastBid.amount) || 0);
            const teamMatch = (data.snapshot?.teams || teamsCache.current).find((x: any) => x.id === state.lastBid.teamId);
            setBiddingTeam(teamMatch ? teamMatch.name : "None");
        } else {
            setCurrentBid(0);
            setBiddingTeam("Waiting for Bids...");
        }
    }, [auctionId, updateSnapshotCache, soldEffect, triggerConfetti]);

    useEffect(() => {
        const pollInterval = Number(process.env.NEXT_PUBLIC_VIEWER_POLL_INTERVAL_MS) || 2000;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        let timer: any = null;
        let abortController: AbortController | null = null;

        const poll = async () => {
            if (typeof document !== "undefined" && document.hidden) return;
            if (inFlightRef.current) return;

            inFlightRef.current = true;
            const currentSeq = ++seqRef.current;
            abortController = new AbortController();

            try {
                const res = await fetch(`${apiUrl}/live-auction/${auctionId}/view`, {
                    signal: abortController.signal,
                    headers: { "Cache-Control": "no-cache" },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const data = json?.data ?? json;

                // Drop out-of-order responses
                if (currentSeq < seqRef.current) return;

                applyLiveState(data);
                setConnected(true);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setConnected(false);
                }
            } finally {
                inFlightRef.current = false;
            }
        };

        // Start interval
        timer = setInterval(poll, pollInterval);

        // Fetch immediately upon tab returning to foreground
        const handleVisibilityChange = () => {
            if (typeof document !== "undefined" && !document.hidden) {
                poll();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (abortController) abortController.abort();
        };
    }, [auctionId, applyLiveState]);

    // ─── Filtered Players List ───────────────────────────────────────────────
    const filteredPlayers = useMemo(() => {
        let list: PlayerData[] = [];
        if (playerFilter === "ALL") {
            list = [...players.upcoming, ...players.sold, ...players.unsold];
        } else if (playerFilter === "SOLD") {
            list = players.sold;
        } else if (playerFilter === "UNSOLD") {
            list = players.unsold;
        } else if (playerFilter === "UPCOMING") {
            list = players.upcoming;
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
                (getPlayerTeamName(p) && getPlayerTeamName(p).toLowerCase().includes(q))
            );
        }

        if (sortBy === "price_high") {
            list = [...list].sort((a, b) => (Number(b.soldPrice) || Number(b.basePrice) || 0) - (Number(a.soldPrice) || Number(a.basePrice) || 0));
        } else if (sortBy === "price_low") {
            list = [...list].sort((a, b) => (Number(a.soldPrice) || Number(a.basePrice) || 0) - (Number(b.soldPrice) || Number(b.basePrice) || 0));
        } else if (sortBy === "name_asc") {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        }

        return list;
    }, [players, playerFilter, searchQuery, sortBy]);

    const filteredTeams = useMemo(() => {
        if (!searchQuery.trim()) return teams;
        const q = searchQuery.toLowerCase();
        return teams.filter(t => t.name.toLowerCase().includes(q) || (t.shortName && t.shortName.toLowerCase().includes(q)));
    }, [teams, searchQuery]);

    const activeSelectedTeam = useMemo(() => {
        if (!selectedTeam) return null;
        return teams.find(t => t.id === selectedTeam.id) || selectedTeam;
    }, [selectedTeam, teams]);

    const selectedTeamPlayers = useMemo(() => {
        if (!activeSelectedTeam) return [];
        return players.sold.filter(p => p.teamName === activeSelectedTeam.name || p.team?.name === activeSelectedTeam.name);
    }, [activeSelectedTeam, players.sold]);

    return (
        <div className="min-h-screen text-white bg-[#072460] font-sans pb-12 select-none">
            {/* TOP HEADER */}
            <header ref={headerRef} className="sticky top-0 z-50 bg-[#072460]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        {auctionLogo ? (
                            <img src={auctionLogo} alt="Logo" className="h-9 w-auto object-contain max-w-[120px]" />
                        ) : (
                            <img src="/final-1.png" alt="Auction11" className="h-9 w-auto object-contain" />
                        )}
                    </Link>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 border border-white/15">
                        Spectator View
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10 text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                        <span className="hidden xs:inline">{connected ? "LIVE" : "SYNCING"}</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
                {/* STATUS BANNER */}
                <div className="w-full mb-4 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-900/60 border border-white/10 flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide">
                    <span>{banner}</span>
                    <span className="text-white/60 text-xs font-mono">ID: {auctionId.slice(0, 8)}</span>
                </div>

                {/* CURRENT PLAYER BANNER / COUNTDOWN */}
                {isCountdown && countdownData ? (
                    <div className="mb-6 p-8 rounded-2xl bg-[#0a2f7a]/80 border border-white/15 text-center shadow-xl">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#ffba00] mb-2">{countdownData.auctionName}</h2>
                        <p className="text-white/70 text-sm mb-6">Scheduled: {countdownData.date} at {countdownData.time}</p>
                        <div className="flex justify-center gap-4 text-center">
                            <div className="bg-black/30 px-4 py-3 rounded-xl border border-white/10 min-w-[70px]">
                                <span className="block text-2xl font-black text-[#ffba00]">{countdown.days}</span>
                                <span className="text-[10px] uppercase tracking-wider text-white/60">Days</span>
                            </div>
                            <div className="bg-black/30 px-4 py-3 rounded-xl border border-white/10 min-w-[70px]">
                                <span className="block text-2xl font-black text-[#ffba00]">{countdown.hours}</span>
                                <span className="text-[10px] uppercase tracking-wider text-white/60">Hours</span>
                            </div>
                            <div className="bg-black/30 px-4 py-3 rounded-xl border border-white/10 min-w-[70px]">
                                <span className="block text-2xl font-black text-[#ffba00]">{countdown.minutes}</span>
                                <span className="text-[10px] uppercase tracking-wider text-white/60">Mins</span>
                            </div>
                            <div className="bg-black/30 px-4 py-3 rounded-xl border border-white/10 min-w-[70px]">
                                <span className="block text-2xl font-black text-[#ffba00]">{countdown.seconds}</span>
                                <span className="text-[10px] uppercase tracking-wider text-white/60">Secs</span>
                            </div>
                        </div>
                    </div>
                ) : currentPlayer ? (
                    <div className="relative mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c3996]/90 to-[#072460]/95 border border-white/15 shadow-2xl overflow-visible">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-black/40 border-2 border-white/20 shrink-0 shadow-lg">
                                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                    <img
                                        src={currentPlayer.profilePic || fallbackImage}
                                        alt={currentPlayer.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {currentPlayer.category?.name && (
                                        <span
                                            className="absolute bottom-2 left-2 right-2 text-center text-[11px] font-bold py-1 px-2 rounded-md truncate uppercase tracking-wider shadow"
                                            style={{ backgroundColor: currentPlayer.category.color || "#0284c7" }}
                                        >
                                            {currentPlayer.category.name}
                                        </span>
                                    )}
                                </div>

                                {/* Sold Stamp Animation */}
                                <AnimatePresence>
                                    {soldOverlay && (
                                        <motion.div
                                            initial={{ scale: 3, opacity: 0, rotate: -45 }}
                                            animate={{ scale: 1.15, opacity: 1, rotate: -15 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            className="absolute -bottom-6 -right-6 w-36 h-36  sm:w-44 sm:h-44 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col items-center justify-center"
                                        >
                                            <img src="/sold-logo.png" alt="SOLD" className="w-[120px] h-[120px] mt-15 object-contain animate-[heartbeat_1s_ease-in-out_infinite]" />
                                            {winningTeam && (
                                                <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-black/95 text-[#FFD500] font-black text-[9px] sm:text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 shadow-2xl whitespace-nowrap flex flex-col items-center">
                                                    <span>{winningTeam}</span>
                                                    {soldPrice !== null && (
                                                        <span className="text-white text-[8px] sm:text-[9px] mt-0.5">₹{formatCurrency(soldPrice)}</span>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Unsold Stamp */}
                                {unsoldOverlay && (
                                    <div className="absolute -bottom-6 -right-6 w-36 h-36 sm:w-44 sm:h-44 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] pointer-events-none flex flex-col items-center justify-center">
                                        <img src="/unsold-logo.png" alt="UNSOLD" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-medium uppercase">
                                        {currentPlayer.role || "Player"}
                                    </span>
                                    {currentPlayer.age && (
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                                            {currentPlayer.age} Yrs
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
                                    {currentPlayer.name}
                                </h2>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
                                    {statsItems.slice(0, 4).map((st, i) => (
                                        <div key={i} className="bg-black/25 p-2 rounded-lg border border-white/5 text-center md:text-left">
                                            <span className="block text-[10px] uppercase text-white/60 tracking-wider font-semibold">{st.label}</span>
                                            <span className="block text-xs sm:text-sm font-bold text-white truncate">{String(st.val)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 border-t border-white/10">
                                    <div>
                                        <span className="block text-[10px] uppercase text-white/60 tracking-wider font-medium">Base Price</span>
                                        <span className="text-sm font-bold text-white">₹{formatCurrency(currentPlayer.basePrice)}</span>
                                    </div>

                                    <div className="h-8 w-px bg-white/15" />

                                    <div>
                                        <span className="block text-[10px] uppercase text-white/60 tracking-wider font-medium">Current Bid</span>
                                        <span ref={bidAmountRef} className="text-xl sm:text-2xl font-black text-[#ffba00]">
                                            ₹{formatCurrency(currentBid)}
                                        </span>
                                    </div>

                                    <div className="h-8 w-px bg-white/15" />

                                    <div>
                                        <span className="block text-[10px] uppercase text-white/60 tracking-wider font-medium">Leading Team</span>
                                        <span className="text-sm font-extrabold text-emerald-400 truncate max-w-[160px] inline-block">
                                            {biddingTeam}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 p-6 rounded-2xl bg-black/20 border border-white/10 text-center text-white/60">
                        <p className="text-sm font-medium">Waiting for Organizer to select next player...</p>
                    </div>
                )}

                {/* TABS: TEAMS / PLAYERS */}
                <div className="flex items-center justify-between mb-4 border-b border-white/15 pb-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setActiveTab("TEAMS"); setSelectedTeam(null); }}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "TEAMS" ? "bg-[#ffba00] text-[#012972] shadow-lg" : "bg-white/10 text-white hover:bg-white/15"}`}
                        >
                            Teams ({teams.length})
                        </button>
                        <button
                            onClick={() => { setActiveTab("PLAYERS"); setSelectedTeam(null); }}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "PLAYERS" ? "bg-[#ffba00] text-[#012972] shadow-lg" : "bg-white/10 text-white hover:bg-white/15"}`}
                        >
                            Players ({players.upcoming.length + players.sold.length + players.unsold.length})
                        </button>
                    </div>

                    <div className="w-48 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/30 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ffba00]"
                        />
                    </div>
                </div>

                {/* TEAMS VIEW */}
                {activeTab === "TEAMS" && (
                    <div>
                        {activeSelectedTeam ? (
                            <div>
                                <button
                                    onClick={() => setSelectedTeam(null)}
                                    className="mb-4 text-xs font-semibold text-[#ffba00] hover:underline flex items-center gap-1"
                                >
                                    ← Back to All Teams
                                </button>
                                <div className="p-4 rounded-xl bg-black/30 border border-white/10 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={activeSelectedTeam.logo || fallbackImage} alt={activeSelectedTeam.name} className="w-12 h-12 object-contain rounded-lg bg-white/5" />
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{activeSelectedTeam.name}</h3>
                                            <p className="text-xs text-white/60">Players Bought: {selectedTeamPlayers.length}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs text-white/60">Purse Left</span>
                                        <span className="text-sm font-extrabold text-emerald-400">
                                            ₹{formatCurrency(activeSelectedTeam.purse !== undefined ? Number(activeSelectedTeam.purse) : (Number(activeSelectedTeam.originalPurse || defaultBudget) - Number(activeSelectedTeam.purseSpent || 0)))}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {selectedTeamPlayers.map((p) => (
                                        <div key={p.id} className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-center gap-3">
                                            <img src={p.profilePic || fallbackImage} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-white/5" />
                                            <div className="flex-1 truncate">
                                                <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                                                <span className="text-[10px] text-white/60">{p.role || "Player"}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-[#ffba00]">₹{formatCurrency(p.soldPrice)}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {selectedTeamPlayers.length === 0 && (
                                        <p className="text-xs text-white/50 col-span-full py-4 text-center">No players bought by this team yet.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredTeams.map((t) => {
                                    const purseLeft = t.purse !== undefined
                                        ? Number(t.purse)
                                        : (Number(t.originalPurse || defaultBudget) - Number(t.purseSpent || 0));
                                    return (
                                        <div
                                            key={t.id}
                                            onClick={() => setSelectedTeam(t)}
                                            className="cursor-pointer p-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-[#ffba00]/60 transition-all shadow-md group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <img src={t.logo || fallbackImage} alt={t.name} className="w-12 h-12 object-contain rounded-lg bg-white/5" />
                                                <div className="flex-1 truncate">
                                                    <h3 className="font-bold text-sm text-white group-hover:text-[#ffba00] transition-colors truncate">{t.name}</h3>
                                                    <span className="text-[11px] text-white/60">{t.playersCount || 0} Players</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                                                <span className="text-white/60">Purse Left</span>
                                                <span className="font-extrabold text-emerald-400">₹{formatCurrency(purseLeft)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* PLAYERS VIEW */}
                {activeTab === "PLAYERS" && (
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(["ALL", "SOLD", "UNSOLD", "UPCOMING"] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setPlayerFilter(filter)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${playerFilter === filter ? "bg-[#ffba00] text-[#012972]" : "bg-white/10 text-white hover:bg-white/15"}`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filteredPlayers.map((p) => (
                                <div key={p.id} className="p-3 rounded-xl bg-black/25 border border-white/10 flex items-center gap-3">
                                    <img src={p.profilePic || fallbackImage} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-white/5" />
                                    <div className="flex-1 truncate">
                                        <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                                        <span className="text-[10px] text-white/60 block">{p.role || "Player"}</span>
                                        {p.teamName && (
                                            <span className="text-[10px] text-emerald-400 font-medium truncate block">{p.teamName}</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-[#ffba00]">
                                            ₹{formatCurrency(p.soldPrice || p.basePrice)}
                                        </span>
                                        <span className={`block text-[9px] uppercase font-bold ${p.status === "SOLD" ? "text-emerald-400" : p.status === "UNSOLD" ? "text-red-400" : "text-blue-400"}`}>
                                            {p.status || "UPCOMING"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

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
