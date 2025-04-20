import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard that ensures the authenticated user has an activeRole set in the JWT.
 * Should be used in combination with RolesGuard and AuthGuard('jwt').
 */
@Injectable()
export class ActiveRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.activeRole) {
      throw new UnauthorizedException(
        'You must set an active role before accessing this resource.',
      );
    }

    return true;
  }
}
