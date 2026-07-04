/*
  Warnings:

  - Made the column `auctionCode` on table `Auction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "auctionCode" SET NOT NULL;
