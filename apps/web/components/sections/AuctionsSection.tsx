// ── TO CONNECT TO REAL DATA ────────────────────────────────────────────────
// Server component — replace DEMO_AUCTIONS with real API call:
//   import { auctionApi } from "@/lib/api-client";
//   const auctions = await auctionApi.getUpcoming();
//   const liveAuctions = await auctionApi.getLive();
// Your backend: GET /auctions?status=SCHEDULED&limit=6
//               GET /auctions?status=LIVE
// ──────────────────────────────────────────────────────────────────────────

import { DEMO_AUCTIONS, type DemoAuction } from "@/lib/demo-data";
import Image from "next/image";

const DASHBOARD_URL = process.env["NEXT_PUBLIC_DASHBOARD_URL"] ?? "http://localhost:3002";

function AuctionCard({ auction }: { auction: DemoAuction }) {
    const isLive = auction.status === "LIVE";
    const isScheduled = auction.status === "SCHEDULED";
    const startDate = new Date(auction.startTime);

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 hover:border-primary/40 hover:shadow-card-hover transition-all duration-300">
            {/* Cover image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-arena/10">
                <Image
                    src={auction.coverImage}
                    alt={auction.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized // Remove in production — these are external Unsplash URLs for demo
                />
                {/* Status badge */}
                <div
                    className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold ${isLive
                            ? "bg-live text-live-foreground"
                            : isScheduled
                                ? "bg-card/80 backdrop-blur-sm border border-border"
                                : "bg-muted text-muted-foreground"
                        }`}
                >
                    {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-blink" />}
                    {isLive ? "LIVE" : isScheduled ? "Upcoming" : "Ended"}
                </div>

                {/* Countdown / timer */}
                {isLive && auction.endsIn && (
                    <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-mono">
                        {auction.endsIn}
                    </div>
                )}

                {/* Category */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs">
                    {auction.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-base mb-1 line-clamp-1">{auction.title}</h3>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{auction.itemCount} items</span>
                    {isLive
                        ? <span className="text-live font-semibold">{auction.participantCount} bidding live</span>
                        : <span>
                            {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {" · "}
                            {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    }
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        {isLive ? (
                            <>
                                <p className="text-xs text-muted-foreground">Current Bid</p>
                                <p className="text-lg font-black text-live">
                                    ${auction.currentBid.toLocaleString()}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-muted-foreground">Starting From</p>
                                <p className="text-lg font-black gradient-text">
                                    ${auction.startingBid.toLocaleString()}
                                </p>
                            </>
                        )}
                    </div>

                    <a
                        href={isLive
                            ? `${DASHBOARD_URL}/auction/${auction.id}/live`
                            : `${DASHBOARD_URL}/auction/${auction.id}`}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isLive
                                ? "bg-live text-live-foreground hover:bg-live/90 shadow-md"
                                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20"
                            }`}
                    >
                        {isLive ? "Join Live ⚡" : "Register →"}
                    </a>
                </div>
            </div>
        </div>
    );
}

export function AuctionsSection() {
    return (
        <section id="auctions" className="py-24 lg:py-32 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-live/10 border border-live/20 text-live text-xs font-semibold mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-live animate-live-blink" />
                            Live &amp; Upcoming Auctions
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                            Today&apos;s <span className="gradient-text">Auction Floor</span>
                        </h2>
                    </div>
                    <a
                        href={`${DASHBOARD_URL}/auctions`}
                        className="shrink-0 text-sm font-semibold text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                    >
                        View all auctions →
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DEMO_AUCTIONS.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </div>

                {/* CTA to explore more */}
                <div className="mt-12 text-center">
                    <a
                        href={`${DASHBOARD_URL}/auctions`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm font-semibold hover:border-primary/40 hover:bg-card transition-all duration-200"
                    >
                        Browse All Auctions
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
