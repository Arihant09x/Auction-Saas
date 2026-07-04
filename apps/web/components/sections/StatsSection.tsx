import { DEMO_STATS } from "@/lib/demo-data";

// ── TO CONNECT TO REAL DATA ────────────────────────────────────────────────
// 1. In page.tsx, add:
//    import { auctionApi } from "@/lib/api-client";
//    const stats = await auctionApi.getStats(); // create this endpoint in your NestJS backend
// 2. Pass `stats` as a prop to <StatsSection stats={stats} />
// 3. Your backend endpoint: GET /analytics/global-stats → { totalAuctions, totalBidders, totalRevenue, countriesReached }
// ──────────────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M+`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
    return n.toString();
}

const STATS = [
    {
        value: formatNumber(DEMO_STATS.totalAuctions),
        label: "Auctions Hosted",
        icon: "🏛️",
        color: "from-primary/20 to-primary/5",
        textColor: "text-primary",
    },
    {
        value: formatNumber(DEMO_STATS.totalBidders),
        label: "Active Bidders",
        icon: "🙋",
        color: "from-arena/20 to-arena/5",
        textColor: "text-arena",
    },
    {
        value: `$${formatNumber(DEMO_STATS.totalRevenue)}`,
        label: "Revenue Processed",
        icon: "💰",
        color: "from-win/20 to-win/5",
        textColor: "text-win",
    },
    {
        value: `${DEMO_STATS.countriesReached}+`,
        label: "Countries Reached",
        icon: "🌍",
        color: "from-bid/20 to-bid/5",
        textColor: "text-bid",
    },
];

export function StatsSection() {
    return (
        <section id="stats" className="py-16 bg-muted/30 border-y border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border border-border/40 p-6 text-center`}
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className={`text-3xl md:text-4xl font-black ${stat.textColor} mb-1`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
