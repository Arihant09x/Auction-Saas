-- CreateIndex
CREATE INDEX "Auction_organizerId_idx" ON "Auction"("organizerId");

-- CreateIndex
CREATE INDEX "Category_auctionId_idx" ON "Category"("auctionId");

-- CreateIndex
CREATE INDEX "Player_auctionId_idx" ON "Player"("auctionId");

-- CreateIndex
CREATE INDEX "Player_role_idx" ON "Player"("role");

-- CreateIndex
CREATE INDEX "Player_categoryId_idx" ON "Player"("categoryId");

-- CreateIndex
CREATE INDEX "Team_auctionId_idx" ON "Team"("auctionId");
