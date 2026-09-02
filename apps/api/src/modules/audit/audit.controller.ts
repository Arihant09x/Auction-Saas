import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuditService } from './audit.service';

/**
 * AuditController — secured, admin-only endpoints.
 * All routes require Firebase JWT auth + ADMIN/SUPER_ADMIN role.
 */
@Controller('audit')
@UseGuards(AuthGuard('firebase-jwt'), RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * GET /audit?page=1&limit=50
   * Paginated audit log list.
   */
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * GET /audit/:id
   * Single audit log entry.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  /**
   * POST /audit/:id/undo
   * Attempt to reverse a logged mutation using previousValue.
   * Only SUPER_ADMIN / ADMIN can perform undo.
   */
  @Post(':id/undo')
  undoAction(@Param('id') id: string, @Request() req: any) {
    return this.auditService.undoAction(id, req.user?.id);
  }

  /**
   * DELETE /audit/:id
   * Remove a single audit log entry (SUPER_ADMIN only, via RolesGuard bypass).
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(id);
  }
}
