
import type { Metadata } from "next";
import { getAuctionMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ auctionId: string }> | { auctionId: string };
}): Promise<Metadata> {
    const resolved = await Promise.resolve(params);
    return getAuctionMetadata(resolved.auctionId, "overlay");
}

export default function OverlayLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-transparent">
            {children}
        </div>
    );
}

