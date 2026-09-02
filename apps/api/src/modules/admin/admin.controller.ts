import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';

/**
 * AdminController — secured, admin-only REST API.
 * All routes require Firebase JWT auth + ADMIN or SUPER_ADMIN role.
 */
@Controller('admin')
@UseGuards(AuthGuard('firebase-jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─────────────────────────────────────────────────────────────────────
  //  DASHBOARD
  // ─────────────────────────────────────────────────────────────────────

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  // ─────────────────────────────────────────────────────────────────────
  //  LIVE AUCTIONS
  // ─────────────────────────────────────────────────────────────────────

  @Get('live-auctions')
  getLiveAuctions() {
    return this.adminService.getLiveAuctions();
  }

  // ─────────────────────────────────────────────────────────────────────
  //  USERS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * GET /admin/users?page=1&limit=20&search=john&role=USER&status=ACTIVE
   */
  @Get('users')
  getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllUsers({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      role,
      status,
    });
  }

  /**
   * GET /admin/user/:id — full user profile with login history
   */
  @Get('user/:id')
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  /**
   * GET /admin/user/:id/login-history
   */
  @Get('user/:id/login-history')
  getLoginHistory(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getLoginHistory(
      id,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * PUT /admin/user/:id — update arbitrary fields
   */
  @Put('user/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req: any,
  ) {
    return this.adminService.updateUser(id, data, req.user?.id);
  }

  /**
   * DELETE /admin/user/:id — soft-delete
   */
  @Delete('user/:id')
  deleteUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.deleteUser(id, req.user?.id);
  }

  /**
   * POST /admin/user/:id/suspend — SUSPENDED + force logout
   */
  @Post('user/:id/suspend')
  suspendUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.suspendUser(id, req.user?.id);
  }

  /**
   * POST /admin/user/:id/ban — BANNED + force logout
   */
  @Post('user/:id/ban')
  banUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.banUser(id, req.user?.id);
  }

  /**
   * POST /admin/user/:id/restore — restore to ACTIVE
   */
  @Post('user/:id/restore')
  restoreUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.restoreUser(id, req.user?.id);
  }

  /**
   * POST /admin/user/:id/reset-session — force-logout by bumping sessionVersion
   */
  @Post('user/:id/reset-session')
  resetSession(@Param('id') id: string, @Request() req: any) {
    return this.adminService.resetSession(id, req.user?.id);
  }

  /**
   * POST /admin/user/:id/role — change role
   * Body: { role: "MODERATOR" }
   */
  @Post('user/:id/role')
  changeRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Request() req: any,
  ) {
    return this.adminService.changeRole(
      id,
      role as any,
      req.user?.id,
      req.user?.role,
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  //  AUCTIONS & PAYMENTS
  // ─────────────────────────────────────────────────────────────────────

  @Get('auctions')
  getAllAuctions() {
    return this.adminService.getAllAuctions();
  }

  @Get('payments')
  getAllPayments() {
    return this.adminService.getAllPayments();
  }

  @Put('auction/:id')
  updateAuction(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateAuction(id, data);
  }

  @Delete('auction/:id')
  deleteAuction(@Param('id') id: string) {
    return this.adminService.deleteAuction(id);
  }

  // ─────────────────────────────────────────────────────────────────────
  //  TEAMS
  // ─────────────────────────────────────────────────────────────────────

  @Get('teams')
  getAllTeams(@Query('auctionId') auctionId?: string) {
    return this.adminService.getAllTeams(auctionId);
  }

  @Put('team/:id')
  updateTeam(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateTeam(id, data);
  }

  @Delete('team/:id')
  deleteTeam(@Param('id') id: string) {
    return this.adminService.deleteTeam(id);
  }

  // ─────────────────────────────────────────────────────────────────────
  //  PLAYERS
  // ─────────────────────────────────────────────────────────────────────

  @Get('players')
  getAllPlayers(@Query('auctionId') auctionId?: string) {
    return this.adminService.getAllPlayers(auctionId);
  }

  @Put('player/:id')
  updatePlayer(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updatePlayer(id, data);
  }

  @Delete('player/:id')
  deletePlayer(@Param('id') id: string) {
    return this.adminService.deletePlayer(id);
  }
}
