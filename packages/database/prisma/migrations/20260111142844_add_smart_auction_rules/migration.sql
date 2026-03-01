-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "bidRules" JSONB DEFAULT '[]',
ADD COLUMN     "boosterAmount" INTEGER DEFAULT 0,
ADD COLUMN     "boosterTriggerPlayerCount" INTEGER DEFAULT 0,
ADD COLUMN     "isBoosterEnabled" BOOLEAN NOT NULL DEFAULT false;
