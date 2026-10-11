import type { Metadata } from "next";

interface PublicAuctionPreview {
  id: string;
  name: string;
  location?: string | null;
  logo?: string | null;
  sportsType?: string;
  season?: string | null;
  auctionDate?: string;
  auctionStartTime?: string | null;
  status?: string;
}

function sanitizeText(text: string | null | undefined, maxLen = 160): string {
  if (!text) return "";
  return text
    .replace(/[<>"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export async function getAuctionMetadata(
  auctionId: string,
  pageType: "live" | "viewer" | "overlay"
): Promise<Metadata> {
  const apiUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000";

  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ||
    "https://dashboard.auction11.live";

  let preview: PublicAuctionPreview | null = null;

  try {
    const res = await fetch(`${apiUrl}/auction/${auctionId}/public-preview`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      preview = await res.json();
    }
  } catch (err) {
    // Graceful fallback on network error or initial render
  }

  const rawName = preview?.name || "Cricket Auction";
  const name = sanitizeText(rawName, 60);

  let title = "";
  let description = "";
  let canonicalPath = "";

  if (pageType === "live") {
    title = "Live Auction";
    description = "Watch the live auction in real-time. See players, bids, and teams as action unfolds.";
    canonicalPath = `/live/${auctionId}`;
  } else if (pageType === "viewer") {
    title = "Live Auction Viewer";
    description = "Watch the live auction in real-time. See players, bids, and teams as action unfolds.";
    canonicalPath = `/viewer/${auctionId}`;
  } else {
    title = "Overlay";
    description = "Watch the live auction in real-time. See players, bids, and teams as action unfolds.";
    canonicalPath = `/overlay/${auctionId}`;
  }

  const canonicalUrl = `${dashboardUrl}${canonicalPath}`;

  // Image resolution: Must be publicly accessible HTTPS absolute URL
  let imageUrl = `${dashboardUrl}/icon1.png`;
  if (preview?.logo && preview.logo.startsWith("http")) {
    imageUrl = preview.logo;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Auction11",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${name} Auction Logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
