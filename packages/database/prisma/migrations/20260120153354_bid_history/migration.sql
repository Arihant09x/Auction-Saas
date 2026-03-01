/*
  Warnings:

  - The values [bidding] on the enum `PlayerStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `auctionId` to the `BidHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlayerStatus_new" AS ENUM ('UPCOMING', 'BIDDING', 'SOLD', 'UNSOLD');
ALTER TABLE "public"."Player" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "status" TYPE "PlayerStatus_new" USING ("status"::text::"PlayerStatus_new");
ALTER TYPE "PlayerStatus" RENAME TO "PlayerStatus_old";
ALTER TYPE "PlayerStatus_new" RENAME TO "PlayerStatus";
DROP TYPE "public"."PlayerStatus_old";
ALTER TABLE "Player" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "BidHistory" ADD COLUMN     "auctionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BidHistory" ADD CONSTRAINT "BidHistory_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidHistory" ADD CONSTRAINT "BidHistory_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
