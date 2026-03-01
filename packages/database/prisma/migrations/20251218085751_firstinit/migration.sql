-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'BASIC', 'STANDARD', 'PREMIUM', 'ELITE', 'ULTIMATE');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('UPCOMING', 'LIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('BATSMAN', 'BOWLER', 'WICKET_KEEPER', 'ALL_ROUNDER', 'BATTING_ALL_ROUNDER', 'BOWLING_ALL_ROUNDER', 'ALL_ROUNDER_WICKET_KEEPER', 'BATTER', 'GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'OTHER');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('UPCOMING', 'bidding', 'SOLD', 'UNSOLD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "mobile" TEXT,
    "city" TEXT,
    "profileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeCustomerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "sportsType" TEXT NOT NULL DEFAULT 'Cricket',
    "season" TEXT,
    "auctionDate" TIMESTAMP(3) NOT NULL,
    "auctionStartTime" TEXT,
    "budgetPerTeam" DECIMAL(65,30) NOT NULL DEFAULT 10000000,
    "minBid" DECIMAL(65,30) NOT NULL DEFAULT 500,
    "bidIncrease" DECIMAL(65,30) NOT NULL DEFAULT 500,
    "minPlayersPerTeam" INTEGER NOT NULL DEFAULT 11,
    "maxPlayersPerTeam" INTEGER NOT NULL DEFAULT 15,
    "planTier" "PlanTier" NOT NULL DEFAULT 'FREE',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "status" "AuctionStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "baseBid" DECIMAL(65,30),
    "minIncrement" DECIMAL(65,30),
    "maxPlayersPerTeam" INTEGER,
    "minPlayersPerTeam" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "shortcutKey" TEXT,
    "logo" TEXT,
    "originalPurse" DECIMAL(65,30) NOT NULL,
    "purseSpent" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "playersCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "age" INTEGER NOT NULL,
    "fatherName" TEXT,
    "profilePic" TEXT,
    "role" "PlayerRole" NOT NULL DEFAULT 'ALL_ROUNDER',
    "battingStyle" TEXT,
    "bowlingStyle" TEXT,
    "tshirtSize" TEXT,
    "trouserSize" TEXT,
    "jerseyName" TEXT,
    "jerseyNumber" INTEGER,
    "status" "PlayerStatus" NOT NULL DEFAULT 'UPCOMING',
    "basePrice" DECIMAL(65,30),
    "teamId" TEXT,
    "soldPrice" DECIMAL(65,30),

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidHistory" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BidHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidHistory" ADD CONSTRAINT "BidHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
