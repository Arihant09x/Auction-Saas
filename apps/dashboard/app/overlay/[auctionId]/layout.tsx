
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Overlay",
    description: "Watch the live auction in real-time. See players, bids, and teams as action unfolds.",
};

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-transparent">
            {children}
        </div>
    );
}
