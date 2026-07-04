import { z } from "zod";

// ─── CREATE AUCTION (Step 1: Basic Info) ─────────────────────────
export const createAuctionSchema = z.object({
    name: z.string().min(3, "Auction name must be at least 3 characters").max(100, "Max 100 characters"),
    auctionDate: z.string().min(1, "Auction date is required"),
    location: z.string().min(2, "Location is required"),
    session: z.string().optional(),
    auctionStartTime: z.string().min(1, "Start time is required"),
    budgetPerTeam: z.coerce.number().min(1000, "Budget must be at least ₹1,000"),
    minBid: z.coerce.number().min(100, "Minimum bid must be at least ₹100"),
    bidIncrease: z.coerce.number().min(100, "Bid increment must be at least ₹100"),
    minPlayersPerTeam: z.coerce.number().min(1, "Must have at least 1 player per team"),
    maxPlayersPerTeam: z.coerce.number().min(1, "Must have at least 1 player per team"),
    sportsType: z.string().min(1, "Sports type is required"),
    logo: z.string().optional()
});

export type CreateAuctionData = z.infer<typeof createAuctionSchema>;

// ─── JOIN AUCTION ────────────────────────────────────────────────
export const joinAuctionSchema = z.object({
    code: z.string()
        .min(1, "Auction code is required")
        .regex(/^[a-zA-Z0-9\-]+$/, "Code can only contain letters, numbers, and dashes")
});

export type JoinAuctionData = z.infer<typeof joinAuctionSchema>;

// ─── TEAM ────────────────────────────────────────────────────────
export const teamSchema = z.object({
    name: z.string().min(2, "Team name must be at least 2 characters").max(50, "Max 50 characters"),
    shortName: z.string().min(1, "Short name is required").max(5, "Max 5 characters"),
    shortcutKey: z.string().max(1, "Must be a single character").optional().or(z.literal("")),
    logo: z.string().optional()
});

export type TeamData = z.infer<typeof teamSchema>;

// ─── CATEGORY ────────────────────────────────────────────────────
export const categorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters").max(50, "Max 50 characters"),
    color: z.string().optional(),
    baseBid: z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.literal("")]).optional(),
    minIncrement: z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.literal("")]).optional(),
    minPlayersPerTeam: z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.literal("")]).optional(),
    maxPlayersPerTeam: z.union([z.coerce.number().min(0, "Must be ≥ 0"), z.literal("")]).optional()
});

export type CategoryData = z.infer<typeof categorySchema>;

// ─── PLAYER (Manual Entry) ───────────────────────────────────────
export const playerSchema = z.object({
    name: z.string().min(2, "Player name must be at least 2 characters"),
    mobile: z.string().min(10, "Mobile must be at least 10 digits").regex(/^[0-9+\-\s]+$/, "Invalid mobile number"),
    age: z.coerce.number().min(5, "Age must be at least 5").max(100, "Age must be under 100"),
    role: z.enum(["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKET_KEEPER"], { errorMap: () => ({ message: "Select a valid role" }) }),
    basePrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
    fatherName: z.string().optional().or(z.literal("")),
    battingStyle: z.string().optional().or(z.literal("")),
    bowlingStyle: z.string().optional().or(z.literal("")),
    tshirtSize: z.string().optional().or(z.literal("")),
    trouserSize: z.string().optional().or(z.literal("")),
    profilePic: z.string().optional().or(z.literal(""))
});

export type PlayerData = z.infer<typeof playerSchema>;

// ─── DETAILS PAGE: Timer Settings ────────────────────────────────
export const timerSettingsSchema = z.object({
    timerMode: z.string().min(1, "Select a timer mode"),
    startSec: z.coerce.number().min(0, "Must be ≥ 0").optional(),
    refreshSec: z.coerce.number().min(0, "Must be ≥ 0").optional()
});

export const boosterSchema = z.object({
    boosterName: z.string().min(1, "Booster name is required"),
    afterValue: z.coerce.number().min(1, "After value must be > 0")
});

export const bidIncrementSchema = z.object({
    incrementValue: z.coerce.number().min(1, "Increment must be > 0"),
    afterPoints: z.coerce.number().min(1, "After points must be > 0")
});

// ─── HELPER: Format Zod Errors ──────────────────────────────────
export function formatZodErrors(error: z.ZodError): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const issue of error.issues) {
        const key = issue.path.join(".");
        if (!errors[key]) {
            errors[key] = issue.message;
        }
    }
    return errors;
}

// ─── PAYMENT: Create Order ───────────────────────────────────────
export const createOrderSchema = z.object({
    auctionId: z.string().min(1, "Auction ID is required"),
    planTier: z.enum(["FREE", "BASIC", "STANDARD", "PREMIUM", "ELITE", "ULTIMATE", "MEGA"], {
        errorMap: () => ({ message: "Select a valid plan tier" })
    })
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;

// ─── PAYMENT: Verify Payment ────────────────────────────────────
export const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string().min(1, "Order ID is required"),
    razorpayPaymentId: z.string().min(1, "Payment ID is required"),
    razorpaySignature: z.string().min(1, "Signature is required"),
    auctionId: z.string().min(1, "Auction ID is required"),
    planTier: z.enum(["FREE", "BASIC", "STANDARD", "PREMIUM", "ELITE", "ULTIMATE", "MEGA"])
});
