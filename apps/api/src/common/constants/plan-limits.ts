import {
  AuctionStatus,
  PlanTier,
} from "../../../../../packages/database/dist/generated";

export const PLAN_LIMITS: Record<
  PlanTier,
  { totalPlayers: number; price: number }
> = {
  FREE: {
    totalPlayers: 100,
    price: 0,
  },
  BASIC: {
    totalPlayers: 200,
    price: 3000 * 100, // in Paise
  },
  STANDARD: {
    totalPlayers: 400,
    price: 4500 * 100,
  },
  PREMIUM: {
    totalPlayers: 1200,
    price: 7000 * 100,
  },
  ELITE: {
    totalPlayers: 2500,
    price: 10000 * 100,
  },
  ULTIMATE: {
    totalPlayers: 5000,
    price: 15000 * 100,
  },
};

export const REQUIRED_EXCEL_HEADERS = [
  "Name",
  "Age",
  "Mobile",
  "Specification 1",
  "Profile_url",
];
export const ACTIVE_STATUSES = ["DRAFT", "UPCOMING", "LIVE"];
export const ACTIVE_AUCTION_LIMITS = {
  FREE: 1,
  BASIC: 3,
  STANDARD: 5,
  PREMIUM: 10,
  ELITE: 25,
  ULTIMATE: 42,
};

export interface Auction {
  id: string;
  organizerId: string;
  organizer: string;
  name: string;
  logo: string;
  date: Date;
  location: string;
  sportsType: string;
  season: string;
  auctionDate: Date;
  auctionStartTime: Date;
  budgetPerTeam: number;
  minBid: number;
  bidIncrease: number;
  maxPlayersPerTeam: number;
  minPlayersPerTeam: number;
  bidRules: any;
  isBoosterEnabled: boolean;
  boosterAmount: number;
  boosterTriggerPlayerCount: number;
  PlanTier: PlanTier;
  isPaid: boolean;
  status: AuctionStatus;
  createdAt: Date;
  updatedAt: Date;
}
