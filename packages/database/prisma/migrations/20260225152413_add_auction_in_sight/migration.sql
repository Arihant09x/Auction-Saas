-- CreateTable
CREATE TABLE "AuctionInsight" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuctionInsight_auctionId_key" ON "AuctionInsight"("auctionId");

-- AddForeignKey
ALTER TABLE "AuctionInsight" ADD CONSTRAINT "AuctionInsight_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
