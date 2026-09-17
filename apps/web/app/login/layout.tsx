import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In to Auction11.live | Player Auction Software | Auction 11",
    description:
        "Access your Auction11.live account to manage player auctions, teams, tournaments, bidding activity, and auction settings from one dashboard.",
    keywords: ["upcoming auctions", "scheduled sports auctions", "cricket auction calendar", "football auction schedule", "kabaddi auction", " Auction11"],
    openGraph: {
        title: "Sign In to Auction11.live | Player Auction Software | Auction 11",
        description:
            "Access your Auction11.live account to manage player auctions, teams, tournaments, bidding activity, and auction settings from one dashboard.",
        url: "https://auction11.live/today-auction",
        siteName: "Auction11",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sign In to Auction11.live | Player Auction Software | Auction 11",
        description:
            "Access your Auction11.live account to manage player auctions, teams, tournaments, bidding activity, and auction settings from one dashboard.",
    },
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}
