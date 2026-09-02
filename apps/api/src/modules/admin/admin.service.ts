import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

// Valid roles that can be assigned via the admin panel
const ASSIGNABLE_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR',
  'SUPPORT',
  'CONTENT_EDITOR',
  'ANALYST',
  'USER',
] as const;

type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────
  //  DASHBOARD
  // ─────────────────────────────────────────────────────────────────────

  async getStats() {
    const [totalUsers, totalAuctions, totalPlayers, paidAuctions, liveAuctions] =
      await Promise.all([
        this.prisma.prisma.user.count({ where: { deletedAt: null } }),
        this.prisma.prisma.auction.count(),
        this.prisma.prisma.player.count(),
        this.prisma.prisma.auction.count({ where: { isPaid: true } }),
        this.prisma.prisma.auction.count({ where: { status: 'LIVE' } }),
      ]);

    return {
      totalUsers,
      totalAuctions,
      totalPlayers,
      totalPaidAuctions: paidAuctions,
      liveAuctions,
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  //  USERS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Paginated user list with optional filters.
   */
  async getAllUsers(opts?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (opts?.search) {
      where.OR = [
        { name: { contains: opts.search, mode: 'insensitive' } },
        { email: { contains: opts.search, mode: 'insensitive' } },
        { mobile: { contains: opts.search, mode: 'insensitive' } },
      ];
    }
    if (opts?.role) where.role = opts.role;
    if (opts?.status) where.status = opts.status;

    const [items, total] = await Promise.all([
      this.prisma.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          city: true,
          role: true,
          status: true,
          profileUrl: true,
          createdAt: true,
          deletedAt: true,
          _count: { select: { auctions: true } },
        },
      }),
      this.prisma.prisma.user.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Single user profile with login history.
   */
  async getUserDetails(id: string) {
    const user = await this.prisma.prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { auctions: true, joinedAuctions: true } },
        loginHistories: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, data: any, performedBy: string) {
    const previous = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!previous) throw new NotFoundException('User not found');

    const updated = await this.prisma.prisma.user.update({ where: { id }, data });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_UPDATE_USER',
      endpoint: `/admin/user/${id}`,
      targetEntity: 'User',
      targetId: id,
      previousValue: previous,
      newValue: updated,
    });

    return updated;
  }

  /**
   * Soft-delete a user (sets deletedAt).
   */
  async deleteUser(id: string, performedBy: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot delete a SUPER_ADMIN account.');
    }

    const deleted = await this.prisma.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_DELETE_USER',
      endpoint: `/admin/user/${id}`,
      targetEntity: 'User',
      targetId: id,
      previousValue: { deletedAt: null },
      newValue: { deletedAt: deleted.deletedAt },
    });

    return { message: 'User soft-deleted', id };
  }

  /**
   * Suspend a user (SUSPENDED status + bump sessionVersion to force logout).
   */
  async suspendUser(id: string, performedBy: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot suspend a SUPER_ADMIN account.');
    }

    const updated = await this.prisma.prisma.user.update({
      where: { id },
      data: {
        status: 'SUSPENDED',
        sessionVersion: { increment: 1 }, // invalidates all active tokens
      },
    });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_SUSPEND_USER',
      endpoint: `/admin/user/${id}/suspend`,
      targetEntity: 'User',
      targetId: id,
      previousValue: { status: user.status, sessionVersion: user.sessionVersion },
      newValue: { status: 'SUSPENDED', sessionVersion: updated.sessionVersion },
    });

    return { message: 'User suspended', id };
  }

  /**
   * Ban a user (BANNED status + bump sessionVersion to force logout).
   */
  async banUser(id: string, performedBy: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot ban a SUPER_ADMIN account.');
    }

    const updated = await this.prisma.prisma.user.update({
      where: { id },
      data: {
        status: 'BANNED',
        sessionVersion: { increment: 1 },
      },
    });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_BAN_USER',
      endpoint: `/admin/user/${id}/ban`,
      targetEntity: 'User',
      targetId: id,
      previousValue: { status: user.status, sessionVersion: user.sessionVersion },
      newValue: { status: 'BANNED', sessionVersion: updated.sessionVersion },
    });

    return { message: 'User banned', id };
  }

  /**
   * Restore a suspended/banned user back to ACTIVE.
   */
  async restoreUser(id: string, performedBy: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_RESTORE_USER',
      endpoint: `/admin/user/${id}/restore`,
      targetEntity: 'User',
      targetId: id,
      previousValue: { status: user.status },
      newValue: { status: 'ACTIVE' },
    });

    return { message: 'User restored to ACTIVE', id };
  }

  /**
   * Force-logout a user by bumping sessionVersion.
   */
  async resetSession(id: string, performedBy: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.prisma.user.update({
      where: { id },
      data: { sessionVersion: { increment: 1 } },
    });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_RESET_SESSION',
      endpoint: `/admin/user/${id}/reset-session`,
      targetEntity: 'User',
      targetId: id,
      previousValue: { sessionVersion: user.sessionVersion },
      newValue: { sessionVersion: updated.sessionVersion },
    });

    return { message: 'Session invalidated — user will be logged out', id };
  }

  /**
   * Change a user's role.
   * A SUPER_ADMIN role can only be granted/revoked by another SUPER_ADMIN
   * (caller's role must be checked at the controller level).
   */
  async changeRole(
    id: string,
    newRole: AssignableRole,
    performedBy: string,
    performedByRole: string,
  ) {
    if (!ASSIGNABLE_ROLES.includes(newRole as any)) {
      throw new BadRequestException(`Invalid role: ${newRole}`);
    }

    const user = await this.prisma.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Only SUPER_ADMIN can assign/revoke SUPER_ADMIN role
    if (
      (newRole === 'SUPER_ADMIN' || user.role === 'SUPER_ADMIN') &&
      performedByRole !== 'SUPER_ADMIN'
    ) {
      throw new ForbiddenException(
        'Only a SUPER_ADMIN can grant or revoke the SUPER_ADMIN role.',
      );
    }

    const updated = await this.prisma.prisma.user.update({
      where: { id },
      data: { role: newRole as any },
    });

    await this.auditService.logWithContext({
      userId: performedBy,
      action: 'ADMIN_CHANGE_ROLE',
      endpoint: `/admin/user/${id}/role`,
      targetEntity: 'User',
      targetId: id,
      previousValue: { role: user.role },
      newValue: { role: newRole },
    });

    return { message: `Role changed to ${newRole}`, id };
  }

  /**
   * Get login history for a user.
   */
  async getLoginHistory(userId: string, limit = 50) {
    return this.prisma.prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  AUCTIONS & PAYMENTS
  // ─────────────────────────────────────────────────────────────────────

  async getAllAuctions() {
    return this.prisma.prisma.auction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: { select: { name: true, email: true, mobile: true } },
      },
    });
  }

  async getAllPayments() {
    return this.prisma.prisma.auction.findMany({
      where: { isPaid: true },
      select: {
        id: true,
        name: true,
        planTier: true,
        razorpayPaymentId: true,
        razorpayOrderId: true,
        createdAt: true,
        organizer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAuction(id: string, data: any) {
    return this.prisma.prisma.auction.update({ where: { id }, data });
  }

  async deleteAuction(id: string) {
    return this.prisma.prisma.auction.delete({ where: { id } });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  TEAMS
  // ─────────────────────────────────────────────────────────────────────

  async getAllTeams(auctionId?: string) {
    const where = auctionId ? { auctionId } : {};
    return this.prisma.prisma.team.findMany({
      where,
      include: { auction: { select: { name: true } } },
    });
  }

  async updateTeam(id: string, data: any) {
    return this.prisma.prisma.team.update({ where: { id }, data });
  }

  async deleteTeam(id: string) {
    return this.prisma.prisma.team.delete({ where: { id } });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  PLAYERS
  // ─────────────────────────────────────────────────────────────────────

  async getAllPlayers(auctionId?: string) {
    const where = auctionId ? { auctionId } : {};
    return this.prisma.prisma.player.findMany({
      where,
      include: {
        auction: { select: { name: true } },
        category: { select: { name: true } },
      },
      take: 100,
    });
  }

  async updatePlayer(id: string, data: any) {
    return this.prisma.prisma.player.update({ where: { id }, data });
  }

  async deletePlayer(id: string) {
    return this.prisma.prisma.player.delete({ where: { id } });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  LIVE AUCTIONS
  // ─────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────
  //  GLOBAL ANALYTICS
  // ─────────────────────────────────────────────────────────────────────

  async getAnalytics() {
    const [
      totalUsers,
      totalAuctions,
      totalRevenue,
      auctionsByStatus,
      planDistribution,
      recentPayments,
      usersByRole,
    ] = await Promise.all([
      this.prisma.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.prisma.auction.count(),
      this.prisma.prisma.auction.count({ where: { isPaid: true } }),
      this.prisma.prisma.auction.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.prisma.auction.groupBy({
        by: ['planTier'],
        _count: { planTier: true },
      }),
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
      this.prisma.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
        where: { deletedAt: null },
      }),
    ]);

    return {
      summary: {
        totalUsers,
        totalAuctions,
        totalPaidAuctions: totalRevenue,
      },
      auctionsByStatus: auctionsByStatus.map((a: any) => ({
        status: a.status,
        count: a._count.status,
      })),
      planDistribution: planDistribution.map((p: any) => ({
        plan: p.planTier,
        count: p._count.planTier,
      })),
      usersByRole: usersByRole.map((u: any) => ({
        role: u.role,
        count: u._count.role,
      })),
      recentPayments,
    };
  }
}
