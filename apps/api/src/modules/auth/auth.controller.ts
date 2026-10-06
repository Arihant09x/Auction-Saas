import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("register")
  @UseGuards(AuthGuard("firebase-jwt")) // Verifies Token first
  async register(
    @Request() req: any,
    @Body() body: any
  ) {
    return this.authService.validateUser(req.user, body);
  }

  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Post("login")
  @UseGuards(AuthGuard("firebase-jwt")) // Verifies Token first
  async login(
    @Request() req: any,
    @Body() body: any
  ) {
    return this.authService.validateUser(req.user, body);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("verify-email")
  @UseGuards(AuthGuard("firebase-jwt"))
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Request() req: any
  ) {
    return this.authService.verifyEmail(req.user);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("set-password")
  @UseGuards(AuthGuard("firebase-jwt"))
  @HttpCode(HttpStatus.OK)
  async setPassword(
    @Request() req: any,
    @Body("password") password: string
  ) {
    return this.authService.setPasswordForLoggedInUser(req.user, password);
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
