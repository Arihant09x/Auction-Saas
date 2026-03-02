import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../../common/guards/roles.guard";

// 🔒 SECURITY: Only Logged-in Users who are 'ADMIN' can touch these
@Controller("admin")
@UseGuards(AuthGuard("firebase-jwt"), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // --- DASHBOARD ---
  @Get("stats")
  getStats() {
    return this.adminService.getStats();
  }

  // --- GLOBAL ANALYTICS ---
  @Get("analytics")
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  // --- LIVE AUCTION MONITOR ---
  @Get("live-auctions")
  getLiveAuctions() {
    return this.adminService.getLiveAuctions();
  }

  // --- 1. USERS MANAGEMENT ---
  @Get("users")
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put("user/:id")
  updateUser(@Param("id") id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Delete("user/:id")
  deleteUser(@Param("id") id: string) {
    return this.adminService.deleteUser(id);
  }

  // --- 2. AUCTION MANAGEMENT ---
  @Get("auctions")
  getAllAuctions() {
    return this.adminService.getAllAuctions();
  }

  @Get("payments") // View all paid auctions
  getAllPayments() {
    return this.adminService.getAllPayments();
  }

  @Put("auction/:id")
  updateAuction(@Param("id") id: string, @Body() data: any) {
    return this.adminService.updateAuction(id, data);
  }

  @Delete("auction/:id")
  deleteAuction(@Param("id") id: string) {
    return this.adminService.deleteAuction(id);
  }

  // --- 3. TEAM MANAGEMENT ---
  @Get("teams")
  getAllTeams(@Query("auctionId") auctionId?: string) {
    return this.adminService.getAllTeams(auctionId);
  }

  @Put("team/:id")
  updateTeam(@Param("id") id: string, @Body() data: any) {
    return this.adminService.updateTeam(id, data);
  }

  @Delete("team/:id")
  deleteTeam(@Param("id") id: string) {
    return this.adminService.deleteTeam(id);
  }

  // --- 4. PLAYER MANAGEMENT ---
  @Get("players")
  getAllPlayers(@Query("auctionId") auctionId?: string) {
    return this.adminService.getAllPlayers(auctionId);
  }

  @Put("player/:id")
  updatePlayer(@Param("id") id: string, @Body() data: any) {
    return this.adminService.updatePlayer(id, data);
  }

  @Delete("player/:id")
  deletePlayer(@Param("id") id: string) {
    return this.adminService.deletePlayer(id);
  }
}
