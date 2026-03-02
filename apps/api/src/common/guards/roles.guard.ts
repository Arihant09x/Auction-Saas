import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RolesGuard — Flexible role-based access control.
 *
 * Behavior:
 * - ADMIN always passes (superuser bypass).
 * - If a route has @Roles(...roles) metadata, the user must have one of those roles.
 * - If no @Roles() metadata is present, the guard defaults to ADMIN-only
 *   (backward-compatible with the existing AdminController behavior).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    // ADMIN always passes — superuser bypass
    if (user.role === 'ADMIN') return true;

    // Check if the route declares allowed roles via @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Roles() decorator → default: ADMIN-only (backward compat)
    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('Access Denied: Admins Only');
    }

    // Check if user's role matches any of the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access Denied: Required role(s): ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
