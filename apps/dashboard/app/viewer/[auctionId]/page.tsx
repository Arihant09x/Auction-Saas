import ViewerLiveAuctionClient from "./ViewerLiveAuctionClient";

async function getInitialViewerData(auctionId: string) {
    try {
        const apiUrl =
            process.env.INTERNAL_API_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            "http://localhost:3000";

        const res = await fetch(`${apiUrl}/live-auction/${auctionId}/view`, {
            cache: "no-store",
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? json;
    } catch (err) {
        // Fallback for SSR network errors — client will hydrate and poll
        return null;
    }
}

export default async function ViewerPage({
    params,
}: {
    params: Promise<{ auctionId: string }> | { auctionId: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const auctionId = resolvedParams.auctionId;
    const initialData = await getInitialViewerData(auctionId);

    return (
        <ViewerLiveAuctionClient
            auctionId={auctionId}
            initialData={initialData}
        />
    );
}
