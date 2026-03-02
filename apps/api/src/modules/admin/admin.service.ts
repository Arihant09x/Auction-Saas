import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  // --- DASHBOARD ---
  async getStats() {
    const totalUsers = await this.prisma.prisma.user.count();
    const totalAuctions = await this.prisma.prisma.auction.count();
    const totalPlayers = await this.prisma.prisma.player.count();
    const paidAuctions = await this.prisma.prisma.auction.count({
      where: { isPaid: true },
    });

    return {
      totalUsers,
      totalAuctions,
      totalPlayers,
      totalPaidAuctions: paidAuctions,
    };
  }

  // --- USERS ---
  async getAllUsers() {
    // Returns full profile: Name, Email, Mobile, City, Role, Plan Details
    return this.prisma.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { auctions: true } }, // Shows how many auctions they created
      },
    });
  }

  async updateUser(id: string, data: any) {
    // Dangerous: Can change Roles, Emails, etc.
    return this.prisma.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    // Cascading delete will handle auctions/players if configured in Schema,
    // otherwise this might fail if they have related data.
    // For now, simple delete:
    return this.prisma.prisma.user.delete({ where: { id } });
  }

  // --- AUCTIONS & PAYMENTS ---
  async getAllAuctions() {
    return this.prisma.prisma.auction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        organizer: { select: { name: true, email: true, mobile: true } }, // See who owns it
      },
    });
  }

  async getAllPayments() {
    // Filters only PAID auctions to show revenue history
    return this.prisma.prisma.auction.findMany({
      where: { isPaid: true },
      select: {
        id: true,
        name: true,
        planTier: true,
        razorpayPaymentId: true,
        razorpayOrderId: true,
        createdAt: true, // Payment Date
        organizer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAuction(id: string, data: any) {
    return this.prisma.prisma.auction.update({ where: { id }, data });
  }

  async deleteAuction(id: string) {
    return this.prisma.prisma.auction.delete({ where: { id } });
  }

  // --- TEAMS ---
  async getAllTeams(auctionId?: string) {
    // If auctionId provided, filter by it. Else show ALL teams in DB.
    const where = auctionId ? { auctionId } : {};
    return this.prisma.prisma.team.findMany({
      where,
      include: { auction: { select: { name: true } } }, // See which auction it belongs to
    });
  }

  async updateTeam(id: string, data: any) {
    return this.prisma.prisma.team.update({ where: { id }, data });
  }

  async deleteTeam(id: string) {
    return this.prisma.prisma.team.delete({ where: { id } });
  }

  // --- PLAYERS ---
  async getAllPlayers(auctionId?: string) {
    const where = auctionId ? { auctionId } : {};
    return this.prisma.prisma.player.findMany({
      where,
      include: {
        auction: { select: { name: true } },
        category: { select: { name: true } },
      },
      take: 100, // Limit to 100 so server doesn't crash if you have 5000 players
    });
  }

  async updatePlayer(id: string, data: any) {
    return this.prisma.prisma.player.update({ where: { id }, data });
  }

  async deletePlayer(id: string) {
    return this.prisma.prisma.player.delete({ where: { id } });
  }

  // --- LIVE AUCTIONS ---
  async getLiveAuctions() {
    return this.prisma.prisma.auction.findMany({
      where: { status: 'LIVE' },
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: { select: { name: true, email: true } },
        _count: { select: { teams: true, players: true } },
      },
    });
  }

  // --- GLOBAL ANALYTICS ---
  async getAnalytics() {
    const [
      totalUsers,
      totalAuctions,
      totalRevenue,
      auctionsByStatus,
      planDistribution,
      recentPayments,
    ] = await Promise.all([
      // 1. User count
      this.prisma.prisma.user.count(),

      // 2. Total auctions
      this.prisma.prisma.auction.count(),

      // 3. Paid auction count (proxy for revenue pipeline)
      this.prisma.prisma.auction.count({ where: { isPaid: true } }),

      // 4. Auctions grouped by status
      this.prisma.prisma.auction.groupBy({
        by: ['status'],
        _count: { status: true },
      }),

      // 5. Plan tier distribution
      this.prisma.prisma.auction.groupBy({
        by: ['planTier'],
        _count: { planTier: true },
      }),

      // 6. Last 10 paid auctions (revenue stream)
      this.prisma.prisma.auction.findMany({
        where: { isPaid: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          planTier: true,
          razorpayPaymentId: true,
          createdAt: true,
          organizer: { select: { name: true, email: true } },
        },
      }),
    ]);

    return {
      summary: {
        totalUsers,
        totalAuctions,
        totalPaidAuctions: totalRevenue,
      },
      auctionsByStatus: auctionsByStatus.map((a) => ({
        status: a.status,
        count: a._count.status,
      })),
      planDistribution: planDistribution.map((p) => ({
        plan: p.planTier,
        count: p._count.planTier,
      })),
      recentPayments,
    };
  }
}
