import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Throttle } from "@nestjs/throttler";
import * as firebase from "firebase-admin";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("register")
  @UseGuards(AuthGuard("firebase-jwt")) // Verifies Token first
  async register(
    @Request() req: any,
    @Body() body: any
  ) {
    return this.authService.validateUser(req.user, body);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  @UseGuards(AuthGuard("firebase-jwt")) // Verifies Token first
  async login(
    @Request() req: any,
    @Body() body: any
  ) {
    // 2. If valid, find/create in DB
    return this.authService.validateUser(req.user, body);
  }

  @Post("logout-all-devices")
  @UseGuards(AuthGuard("firebase-jwt"))
  async logoutAllDevices(@Request() req: any) {
    if (req.user && req.user.firebaseUid) {
      await firebase.auth().revokeRefreshTokens(req.user.firebaseUid);
      return { success: true, message: "Successfully revoked refresh tokens for all devices." };
    }
    throw new UnauthorizedException("Cannot revoke tokens: User session is invalid.");
  }
}
