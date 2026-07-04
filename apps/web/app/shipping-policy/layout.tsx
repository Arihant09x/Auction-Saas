import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping & Delivery Policy",
    description:
        "Read Auction11's Shipping & Delivery Policy to understand account activation timelines, service delivery, subscription access, and platform onboarding.",
    keywords: ["upcoming auctions", "scheduled sports auctions", "cricket auction calendar", "football auction schedule", "kabaddi auction", " Auction11"],
    openGraph: {
        title: "Shipping & Delivery Policy | Auction11",
        description:
            "Read Auction11's Shipping & Delivery Policy to understand account activation timelines, service delivery, subscription access, and platform onboarding.",
        url: "https://auctionxi.com/today-auction",
        siteName: "Auction11",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Today's Auctions | Cricket, Football & Kabaddi | Auction11",
        description:
            "Discover today's live player auctions on Auction11. Track player bidding, team formations, budgets, and auction results in real time.",
    },
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}
