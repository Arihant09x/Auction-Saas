import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Read Auction11's terms and conditions. Understand your rights, responsibilities and usage rules when using our cricket auction platform.",
    keywords: ["terms and conditions", "terms of service", "auction platform terms", "user agreement", "Auction11", " Auction11"],
    openGraph: {
        title: "Terms & Conditions | Auction11",
        description:
            "Read Auction11's terms and conditions. Understand your rights, responsibilities and usage rules when using our cricket auction platform.",
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
