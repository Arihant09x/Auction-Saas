/*
  Warnings:

  - A unique constraint covering the columns `[auctionCode]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "auctionCode" TEXT DEFAULT gen_random_uuid();

-- CreateTable
CREATE TABLE "JoinedAuction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JoinedAuction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JoinedAuction_userId_auctionId_key" ON "JoinedAuction"("userId", "auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_auctionCode_key" ON "Auction"("auctionCode");

-- AddForeignKey
ALTER TABLE "JoinedAuction" ADD CONSTRAINT "JoinedAuction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinedAuction" ADD CONSTRAINT "JoinedAuction_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
