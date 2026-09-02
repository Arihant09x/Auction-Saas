import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Throttle } from "@nestjs/throttler";
import * as firebase from "firebase-admin";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

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

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("register-password")
  async registerPassword(@Body("email") email: string, @Body("password") password: string) {
    return this.authService.registerWithPassword(email, password);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login-password")
  @HttpCode(HttpStatus.OK)
  async loginPassword(@Body("email") email: string, @Body("password") password: string) {
    const user = await this.authService.loginWithPassword(email, password);
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }
}
