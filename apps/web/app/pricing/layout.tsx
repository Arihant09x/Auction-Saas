import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Player Auction Software Pricing & Plans | Auction 11 ",
    description:
        "Compare Auction11.live pricing plans and find the perfect solution for your tournament. Run live player auctions with advanced features and real-time bidding.",
    keywords: ["upcoming auctions", "scheduled sports auctions", "cricket auction calendar", "football auction schedule", "kabaddi auction", " Auction11"],
    openGraph: {
        title: "Player Auction Software Pricing & Plans | Auction 11",
        description:
            "Compare Auction11.live pricing plans and find the perfect solution for your tournament. Run live player auctions with advanced features and real-time bidding.",
        url: "https://auction11.live/pricing",
        siteName: "Auction11.live",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Player Auction Software Pricing & Plans | Auction 11",
        description:
            "Compare Auction11.live pricing plans and find the perfect solution for your tournament. Run live player auctions with advanced features and real-time bidding.",
    },
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}
