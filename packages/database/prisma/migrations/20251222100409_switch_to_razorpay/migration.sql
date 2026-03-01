/*
  Warnings:

  - You are about to drop the column `stripePaymentId` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `Auction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "stripePaymentId",
DROP COLUMN "stripeSessionId",
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;
