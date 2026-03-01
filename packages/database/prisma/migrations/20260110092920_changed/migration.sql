-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuctionStatus" ADD VALUE 'DRAFT';
ALTER TYPE "AuctionStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "ArchivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Auction_organizerId_status_idx" ON "Auction"("organizerId", "status");

-- CreateIndex
CREATE INDEX "Auction_status_idx" ON "Auction"("status");
