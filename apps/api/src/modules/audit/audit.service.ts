import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogContext {
  userId: string;
  action: string;
  endpoint: string;
  details?: any;
  ip?: string;
  userAgent?: string;
  targetEntity?: string;
  targetId?: string;
  previousValue?: any;
  newValue?: any;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────────
  //  INTERNAL HELPERS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Basic fire-and-forget audit log (used by AuditInterceptor).
   */
  async log(
    userId: string,
    action: string,
    endpoint: string,
    details: any,
    ip: string,
    userAgent?: string,
  ) {
    if (!userId) return;
    this.prisma.prisma.auditLog
      .create({
        data: {
          userId,
          action,
          endpoint,
          details: details ? JSON.parse(JSON.stringify(details)) : {},
          ipAddress: ip,
          userAgent: userAgent ?? null,
        },
      })
      .catch((err: any) => console.error('Audit Log Failed:', err));
  }

  /**
   * Rich, context-aware audit log — captures entity state before/after.
   * Used by admin service methods for reversible operations.
   */
  async logWithContext(ctx: LogContext) {
    if (!ctx.userId) return;
    try {
      await this.prisma.prisma.auditLog.create({
        data: {
          userId: ctx.userId,
          action: ctx.action,
          endpoint: ctx.endpoint,
          details: ctx.details
            ? JSON.parse(JSON.stringify(ctx.details))
            : {},
          ipAddress: ctx.ip ?? null,
          userAgent: ctx.userAgent ?? null,
          targetEntity: ctx.targetEntity ?? null,
          targetId: ctx.targetId ?? null,
          previousValue: ctx.previousValue
            ? JSON.parse(JSON.stringify(ctx.previousValue))
            : null,
          newValue: ctx.newValue
            ? JSON.parse(JSON.stringify(ctx.newValue))
            : null,
        },
      });
    } catch (err) {
      console.error('AuditService.logWithContext failed:', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  //  QUERY METHODS  (ADMIN-ONLY)
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Paginated audit log list.
   */
  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      this.prisma.prisma.auditLog.count(),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const audit = await this.prisma.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    if (!audit) throw new NotFoundException('Audit log not found');
    return audit;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.prisma.auditLog.delete({ where: { id } });
  }

  // ─────────────────────────────────────────────────────────────────────
  //  UNDO ACTION
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Attempts to undo a logged mutation by restoring previousValue.
   *
   * Supported actions:
   *  - ADMIN_UPDATE_USER  → restores User fields from previousValue
   *  - ADMIN_DELETE_USER  → cannot be undone (soft-deletes only if deletedAt exists)
   *  - ADMIN_SUSPEND_USER → sets status back to previousValue.status
   *  - ADMIN_BAN_USER     → sets status back to previousValue.status
   *  - ADMIN_CHANGE_ROLE  → restores role from previousValue.role
   *
   * Returns { undone: true, restored } on success or throws.
   */
  async undoAction(logId: string, performedBy: string) {
    const log = await this.findOne(logId);

    if (!log.previousValue) {
      throw new BadRequestException(
        'This action has no recorded previous state and cannot be undone.',
      );
    }

    const prev = log.previousValue as Record<string, any>;
    let restored: any = null;

    switch (log.action) {
      case 'ADMIN_UPDATE_USER':
      case 'ADMIN_SUSPEND_USER':
      case 'ADMIN_BAN_USER':
      case 'ADMIN_CHANGE_ROLE':
      case 'ADMIN_RESTORE_USER': {
        if (!log.targetId) throw new BadRequestException('Missing targetId in log.');

        // Only restore the specific tracked fields to avoid overwriting unrelated data
        const allowedFields = ['status', 'role', 'name', 'email', 'mobile', 'city'];
        const restoreData: Record<string, any> = {};
        for (const field of allowedFields) {
          if (prev[field] !== undefined) restoreData[field] = prev[field];
        }

        if (Object.keys(restoreData).length === 0) {
          throw new BadRequestException('Nothing to restore from previous state.');
        }

        restored = await this.prisma.prisma.user.update({
          where: { id: log.targetId },
          data: restoreData,
        });
        break;
      }

      default:
        throw new BadRequestException(
          `Action "${log.action}" is not reversible.`,
        );
    }

    // Log the undo itself
    await this.logWithContext({
      userId: performedBy,
      action: `UNDO_${log.action}`,
      endpoint: `/admin/audit/${logId}/undo`,
      targetEntity: log.targetEntity ?? undefined,
      targetId: log.targetId ?? undefined,
      previousValue: log.newValue, // what was current before undo
      newValue: log.previousValue, // what was restored
    });

    return { undone: true, restored };
  }
}
