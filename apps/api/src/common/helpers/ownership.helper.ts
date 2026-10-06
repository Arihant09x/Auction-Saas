import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Returns true if the user is either the owner of the resource
 * OR has the ADMIN or SUPER_ADMIN role (which bypasses ownership checks).
 */
export function isAdminOrOwner(
  ownerId: string,
  requesterId: string,
  requesterRole: string,
): boolean {
  if (!requesterId) return false;
  return ownerId === requesterId || requesterRole === 'ADMIN' || requesterRole === 'SUPER_ADMIN';
}

/**
 * Validates that the requesting user is authorized to read or interact with an auction.
 *
 * Rules:
 * 1. ADMIN or SUPER_ADMIN can access any auction.
 * 2. Organizer (auction.organizerId === userId) can access.
 * 3. A participant who has joined via JoinedAuction can access.
 *
 * Otherwise throws ForbiddenException or NotFoundException.
 */
export async function validateAuctionAccess(
  prisma: PrismaService,
  auctionId: string,
  userId: string,
  userRole: string,
): Promise<any> {
  if (!auctionId) {
    throw new NotFoundException("Auction ID is required");
  }

  const auction = await prisma.prisma.auction.findUnique({
    where: { id: auctionId },
  });

  if (!auction) {
    throw new NotFoundException("Auction not found");
  }

  // Admins & Super Admins can access all auctions
  if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
    return auction;
  }

  // Organizer access
  if (auction.organizerId === userId) {
    return auction;
  }

  // Check if participant has joined
  const joined = await prisma.prisma.joinedAuction.findUnique({
    where: {
      userId_auctionId: { userId, auctionId },
    },
  });

  if (joined) {
    return auction;
  }

  throw new ForbiddenException("You are not authorized to access this auction");
}

/**
 * Validates that the requesting user is the ORGANIZER or ADMIN/SUPER_ADMIN of the auction.
 * Rejects regular joined participants (e.g. for managing teams, players, settings, payments).
 */
export async function validateAuctionOwnership(
  prisma: PrismaService,
  auctionId: string,
  userId: string,
  userRole: string,
): Promise<any> {
  if (!auctionId) {
    throw new NotFoundException("Auction ID is required");
  }

  const auction = await prisma.prisma.auction.findUnique({
    where: { id: auctionId },
  });

  if (!auction) {
    throw new NotFoundException("Auction not found");
  }

  if (!isAdminOrOwner(auction.organizerId, userId, userRole)) {
    throw new ForbiddenException("You are not authorized to manage this auction");
  }

  return auction;
}
