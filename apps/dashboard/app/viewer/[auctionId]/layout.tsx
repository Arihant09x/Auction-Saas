import type { Metadata } from "next";
import { getAuctionMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ auctionId: string }> | { auctionId: string };
}): Promise<Metadata> {
    const resolved = await Promise.resolve(params);
    return getAuctionMetadata(resolved.auctionId, "viewer");
}

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "linear-gradient(135deg, #072460 0%, #00379D 50%, #0E4AC6 100%)" }}>
            {children}
        </div>
    );
}

