// Demo data for landing page — replace with real API calls (see lib/api-client.ts)
// Each function shows the exact shape the API will return.
// Usage: Replace `getDemoAuctions()` with `await auctionApi.getUpcoming()` inside a server component.

export interface DemoAuction {
    id: string;
    title: string;
    category: string;
    coverImage: string; // use Cloudinary URL in production: res.cloudinary.com/...
    startTime: string;
    status: "LIVE" | "SCHEDULED" | "ENDED";
    currentBid: number;
    startingBid: number;
    itemCount: number;
    participantCount: number;
    endsIn?: string;
}

export const DEMO_AUCTIONS: DemoAuction[] = [
    {
        id: "auc_001",
        title: "Fine Art & Collectibles — Spring 2026",
        category: "Art",
        coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
        startTime: "2026-03-07T14:00:00Z",
        status: "LIVE",
        currentBid: 145000,
        startingBid: 50000,
        itemCount: 24,
        participantCount: 312,
        endsIn: "02:14:33",
    },
    {
        id: "auc_002",
        title: "Rare Whiskey & Spirits Collection",
        category: "Spirits",
        coverImage: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80",
        startTime: "2026-03-08T10:00:00Z",
        status: "SCHEDULED",
        currentBid: 0,
        startingBid: 5000,
        itemCount: 60,
        participantCount: 0,
        endsIn: undefined,
    },
    {
        id: "auc_003",
        title: "Luxury Wristwatches — Rolex & Patek",
        category: "Watches",
        coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        startTime: "2026-03-10T09:00:00Z",
        status: "SCHEDULED",
        currentBid: 0,
        startingBid: 20000,
        itemCount: 18,
        participantCount: 0,
    },
    {
        id: "auc_004",
        title: "Vintage Cars & Motorcycles Gala",
        category: "Automobiles",
        coverImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
        startTime: "2026-03-12T11:00:00Z",
        status: "SCHEDULED",
        currentBid: 0,
        startingBid: 100000,
        itemCount: 10,
        participantCount: 0,
    },
    {
        id: "auc_005",
        title: "Contemporary Jewelry & Diamonds",
        category: "Jewelry",
        coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        startTime: "2026-03-14T15:00:00Z",
        status: "SCHEDULED",
        currentBid: 0,
        startingBid: 10000,
        itemCount: 45,
        participantCount: 0,
    },
    {
        id: "auc_006",
        title: "Modern Photography & Digital Art",
        category: "Digital Art",
        coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
        startTime: "2026-03-15T16:00:00Z",
        status: "SCHEDULED",
        currentBid: 0,
        startingBid: 2500,
        itemCount: 80,
        participantCount: 0,
    },
];

export const DEMO_STATS = {
    totalAuctions: 1240,
    totalBidders: 48500,
    totalRevenue: 284000000,
    countriesReached: 68,
};

export const DEMO_TESTIMONIALS = [
    {
        id: "t1",
        name: "Sarah Chen",
        title: "Senior Auction Director",
        company: "Christie's Asia Pacific",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        quote: "Auction 11 transformed how we run live auctions. Our participation rates increased by 340% in the first quarter alone.",
        rating: 5,
    },
    {
        id: "t2",
        name: "Marcus Adeyemi",
        title: "Founder",
        company: "Abuja Fine Arts",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        quote: "The real-time bidding is flawless. Zero lag, zero dropped bids. It's like having a physical auction room online.",
        rating: 5,
    },
    {
        id: "t3",
        name: "Priya Nair",
        title: "Head of Digital",
        company: "Sotheby's India",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        quote: "Onboarding was seamless, analytics are incredible, and their support team is world-class.",
        rating: 5,
    },
];

export const FEATURES = [
    {
        icon: "⚡",
        title: "Real-Time Bidding",
        description: "Sub-100ms bid propagation via Socket.io and Redis Pub/Sub. No page reloads, no latency.",
    },
    {
        icon: "🌍",
        title: "Global Scale",
        description: "Host auctions for thousands of simultaneous bidders across 68+ countries.",
    },
    {
        icon: "🔒",
        title: "Bank-Grade Security",
        description: "Firebase Auth, HTTPS-only, tamper-proof bid ledger with full audit trail.",
    },
    {
        icon: "📊",
        title: "Organizer Analytics",
        description: "Live dashboards with revenue tracking, bidder behavior, and auction performance metrics.",
    },
    {
        icon: "📱",
        title: "All Devices",
        description: "Fully responsive — bidders join from mobile, tablet, or desktop without friction.",
    },
    {
        icon: "🤖",
        title: "Smart Automation",
        description: "Auto-advance items, countdown timers, reserve price logic, and outbid notifications.",
    },
];
