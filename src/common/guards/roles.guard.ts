import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

/**
 * Guard that restricts access to routes based on the user's activeRole.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.activeRole) {
      throw new ForbiddenException('User role not found in token');
    }

    if (!requiredRoles.includes(user.activeRole)) {
      throw new ForbiddenException(
        `Access denied for role: ${user.activeRole}`,
      );
    }

    return true;
  }
}
