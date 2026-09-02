-- AlterEnum
ALTER TYPE "PlanTier" ADD VALUE 'MEGA';

-- DropForeignKey
ALTER TABLE "AuctionInsight" DROP CONSTRAINT "AuctionInsight_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "BidHistory" DROP CONSTRAINT "BidHistory_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "JoinedAuction" DROP CONSTRAINT "JoinedAuction_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_auctionId_fkey";

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "liveTheme" TEXT NOT NULL DEFAULT 'logo-1',
ADD COLUMN     "overlayLayout" TEXT NOT NULL DEFAULT 'player-card',
ADD COLUMN     "overlayTheme" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "soldEffect" TEXT NOT NULL DEFAULT 'confetti-center';

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JoinedAuction" ADD CONSTRAINT "JoinedAuction_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidHistory" ADD CONSTRAINT "BidHistory_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionInsight" ADD CONSTRAINT "AuctionInsight_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
