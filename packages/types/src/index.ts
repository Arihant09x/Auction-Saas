// ─── Core Enums ────────────────────────────────────────────────────────────

export enum AuctionStatus {
    DRAFT = "DRAFT",
    SCHEDULED = "SCHEDULED",
    LIVE = "LIVE",
    ENDED = "ENDED",
    CANCELLED = "CANCELLED",
}

export enum BidStatus {
    ACTIVE = "ACTIVE",
    WINNING = "WINNING",
    OUTBID = "OUTBID",
    WON = "WON",
    LOST = "LOST",
}

export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ORGANIZER = "ORGANIZER",
    BIDDER = "BIDDER",
}

// ─── Core Domain Entities ───────────────────────────────────────────────────

export interface User {
    id: string;
    firebaseUid: string;
    email: string;
    displayName: string;
    name: string;
    profileUrl?: string;
    photoURL?: string;
    role: UserRole;
    organizationId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logoURL?: string;
    ownerId: string;
    createdAt: string;
}

export interface AuctionItem {
    id: string;
    auctionId: string;
    title: string;
    description: string;
    imageURLs: string[];
    estimatedValue?: number;
    startingBid: number;
    reservePrice?: number;
    order: number;
}

export interface Auction {
    id: string;
    organizationId: string;
    title: string;
    description: string;
    coverImageURL?: string;
    status: AuctionStatus;
    startTime: string;
    endTime?: string;
    items: AuctionItem[];
    currentItemIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface Bid {
    id: string;
    auctionId: string;
    itemId: string;
    bidderId: string;
    bidderName: string;
    amount: number;
    status: BidStatus;
    placedAt: string;
}

// ─── Live Auction State ─────────────────────────────────────────────────────

export interface LiveAuctionState {
    auctionId: string;
    status: AuctionStatus;
    currentItem: AuctionItem | null;
    currentItemIndex: number;
    totalItems: number;
    currentHighestBid: number;
    currentHighestBidder: string | null;
    bidCount: number;
    bidHistory: Bid[];
    participantCount: number;
    timeRemaining?: number; // seconds
    countdown?: number;     // pre-auction countdown in seconds
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export interface ApiResponse<T> {
    data: T;
    message?: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// ─── WebSocket Event Payloads (Client → Server) ─────────────────────────────

export interface JoinAuctionPayload {
    auctionId: string;
    userId: string;
    token: string;
}

export interface PlaceBidPayload {
    auctionId: string;
    itemId: string;
    amount: number;
    userId: string;
}

export interface LeaveAuctionPayload {
    auctionId: string;
    userId: string;
}

// ─── WebSocket Event Payloads (Server → Client) ─────────────────────────────

export interface NewBidEvent {
    bid: Bid;
    newHighestBid: number;
    newHighestBidder: string;
    bidCount: number;
}

export interface AuctionStateUpdateEvent {
    state: LiveAuctionState;
}

export interface ItemChangedEvent {
    previousItem: AuctionItem | null;
    currentItem: AuctionItem;
    currentItemIndex: number;
}

export interface AuctionEndedEvent {
    auctionId: string;
    winningBids: Array<{ item: AuctionItem; bid: Bid | null }>;
}

export interface ParticipantCountEvent {
    count: number;
}

export interface CountdownEvent {
    secondsRemaining: number;
}

export interface BidErrorEvent {
    message: string;
    code: "BID_TOO_LOW" | "AUCTION_NOT_LIVE" | "UNAUTHORIZED" | "SERVER_ERROR";
}

// ─── WebSocket Event Map ────────────────────────────────────────────────────

export interface ServerToClientEvents {
    "auction:state": (payload: AuctionStateUpdateEvent) => void;
    "auction:new-bid": (payload: NewBidEvent) => void;
    "auction:item-changed": (payload: ItemChangedEvent) => void;
    "auction:ended": (payload: AuctionEndedEvent) => void;
    "auction:countdown": (payload: CountdownEvent) => void;
    "auction:participants": (payload: ParticipantCountEvent) => void;
    "bid:error": (payload: BidErrorEvent) => void;
    "connect_error": (err: Error) => void;
}

export interface ClientToServerEvents {
    "auction:join": (payload: JoinAuctionPayload) => void;
    "auction:leave": (payload: LeaveAuctionPayload) => void;
    "bid:place": (payload: PlaceBidPayload) => void;
}

// ─── Dashboard / Analytics Types ────────────────────────────────────────────

export interface AuctionAnalytics {
    auctionId: string;
    totalRevenue: number;
    totalBids: number;
    uniqueBidders: number;
    itemsSold: number;
    averageBidAmount: number;
    peakParticipants: number;
}

export interface DashboardStats {
    totalAuctions: number;
    liveAuctions: number;
    scheduledAuctions: number;
    totalRevenue: number;
    totalBidders: number;
    recentAuctions: Auction[];
}
