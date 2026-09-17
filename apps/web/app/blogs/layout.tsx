import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sports Auction Blogs | Auction 11",
    description:
        "Explore the Auction11.live Blog for player auction tips, cricket auction strategies, tournament management guides, product updates, and sports auction insights.",
    keywords: ["upcoming auctions", "scheduled sports auctions", "cricket auction calendar", "football auction schedule", "kabaddi auction", " Auction11"],
    openGraph: {
        title: "Sports Auction Blogs | Auction11",
        description:
            "Explore the Auction11.live Blog for player auction tips, cricket auction strategies, tournament management guides, product updates, and sports auction insights.",
        url: "https://auction11.live/blogs",
        siteName: "Auction11.live",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sports Auction Blogs | Auction 11",
        description:
            "Explore the Auction11.live Blog for player auction tips, cricket auction strategies, tournament management guides, product updates, and sports auction insights.",
    },
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}
