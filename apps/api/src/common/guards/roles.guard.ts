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
 * Hierarchy (highest → lowest):
 *   SUPER_ADMIN > ADMIN > MODERATOR / SUPPORT / CONTENT_EDITOR / ANALYST > USER
 *
 * Behavior:
 * - SUPER_ADMIN always passes — absolute superuser, no restrictions.
 * - ADMIN always passes — backward-compatible superuser bypass.
 * - If a route has @Roles(...roles) metadata, the user must have one of those roles.
 * - If no @Roles() metadata is present, defaults to ADMIN/SUPER_ADMIN only.
 */

/** Roles that have unrestricted admin access */
const SUPER_ROLES = new Set(['SUPER_ADMIN', 'ADMIN']);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    // SUPER_ADMIN and ADMIN always pass — highest privilege bypass
    if (SUPER_ROLES.has(user.role)) return true;

    // Check if the route declares allowed roles via @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Roles() decorator → default: SUPER_ADMIN / ADMIN only (backward compat)
    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('Access Denied: Admins Only');
    }

    // Check if the user's role matches any of the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access Denied: Required role(s): ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
