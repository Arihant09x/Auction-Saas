/*
  Warnings:

  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auction_razorpayPaymentId_key" ON "Auction"("razorpayPaymentId");
