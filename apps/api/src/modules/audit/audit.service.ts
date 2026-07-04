import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
// import { CreateAuditDto } from "./dto/create-audit.dto";
// import { UpdateAuditDto } from "./dto/update-audit.dto";
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * INTERNAL USE
   * Fire-and-forget audit logging
   */
  async log(
    userId: string,
    action: string,
    endpoint: string,
    details: any,
    ip: string
  ) {
    this.prisma.prisma.auditLog
      .create({
        data: {
          userId,
          action,
          endpoint,
          details: details ? JSON.parse(JSON.stringify(details)) : {},
          ipAddress: ip,
        },
      })
      .catch((err: any) => console.error("Audit Log Failed:", err));
  }

  /**
   * CRUD METHODS (to satisfy controller)
   * These are usually ADMIN-only
   */

  // async create(dto: CreateAuditDto) {
  //   return this.prisma.prisma.auditLog.create({
  //     data: {
  //       userId: dto.userId,
  //       action: dto.action,
  //       endpoint: dto.endpoint,
  //       details: dto.details ?? {},
  //       ipAddress: dto.ipAddress,
  //     },
  //   });
  // }

  async findAll() {
    return this.prisma.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100, // safety limit
    });
  }

  async findOne(id: string) {
    const audit = await this.prisma.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!audit) {
      throw new NotFoundException("Audit log not found");
    }

    return audit;
  }

  // async update(id: string, dto: UpdateAuditDto) {
  //   await this.findOne(id); // ensure exists

  //   return this.prisma.prisma.auditLog.update({
  //     where: { id },
  //     data: {
  //       action: dto.action,
  //       endpoint: dto.endpoint,
  //       details: dto.details,
  //       ipAddress: dto.ipAddress,
  //     },
  //   });
  // }

  async remove(id: string) {
    await this.findOne(id); // ensure exists

    return this.prisma.prisma.auditLog.delete({
      where: { id },
    });
  }
}
