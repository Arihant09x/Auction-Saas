-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE 'MODERATOR';
ALTER TYPE "Role" ADD VALUE 'SUPPORT';
ALTER TYPE "Role" ADD VALUE 'CONTENT_EDITOR';
ALTER TYPE "Role" ADD VALUE 'ANALYST';

-- AlterTable
ALTER TABLE "AuditLog"
ADD COLUMN "newValue" JSONB,
ADD COLUMN "previousValue" JSONB,
ADD COLUMN "targetEntity" TEXT,
ADD COLUMN "targetId" TEXT,
ADD COLUMN "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "deletedAt" TIMESTAMP(3),
ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginHistory"
ADD CONSTRAINT "LoginHistory_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;