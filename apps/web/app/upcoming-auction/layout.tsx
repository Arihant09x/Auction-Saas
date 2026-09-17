import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Upcoming Auctions | Auction 11",
    description:
        "Explore upcoming player auctions on Auction11.live. Discover scheduled cricket, football, kabaddi, and sports auctions, including dates, teams, and tournament details.",
    keywords: ["upcoming auctions", "scheduled sports auctions", "cricket auction calendar", "football auction schedule", "kabaddi auction", " Auction11"],
    openGraph: {
        title: "Upcoming Auctions | Auction 11",
        description:
            "Explore upcoming player auctions on Auction11.live. Discover scheduled cricket, football, kabaddi, and sports auctions, including dates, teams, and tournament details.",
        url: "https://auction11.live/upcoming-auction",
        siteName: "Auction11.live",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Upcoming Auctions | Auction11.live",
        description:
            "Discover upcoming player auctions on Auction11.live. Track player bidding, team formations, budgets, and auction results in real time.",
    },
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}
