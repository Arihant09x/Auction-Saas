import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Check if user exists (AuthGuard should have run first)
    if (!user) return false;

    // 2. Check if User is ADMIN
    if (user.role === "ADMIN") {
      return true;
    }

    throw new ForbiddenException("Access Denied: Admins Only");
  }
}
