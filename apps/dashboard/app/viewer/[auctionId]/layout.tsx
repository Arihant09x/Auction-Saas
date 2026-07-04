import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Auction Viewer",
    description: "Watch the live auction in real-time. See players, bids, and teams as action unfolds.",
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}
