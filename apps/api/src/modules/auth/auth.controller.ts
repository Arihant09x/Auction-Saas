import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  @UseGuards(AuthGuard("firebase-jwt")) // 1. Verifies Token first
  async login(
    @Request() req: any,
    @Body() body: { name?: string; city?: string; mobile?: string }
  ) {
    // 2. If valid, find/create in DB
    return this.authService.validateUser(req.user, body);
  }
}
