import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/enums/user-role.enum';

/**
 * JWT authentication strategy using Passport.
 * Extracts and validates JWT tokens from Authorization headers.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log('✅ JWT Strategy Initialized');

    // Ensure the JWT secret is properly defined
    if (!process.env.JWT_SECRET) {
      throw new Error('❌ JWT_SECRET is not defined!');
    }

    const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();

    super({
      jwtFromRequest: extractToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the extracted JWT payload.
   * Ensures the token contains necessary user information.
   */
  async validate(payload: any) {
    console.log('🔹 JWT Payload received:', payload);

    if (!payload || !payload.sub || !payload.availableRoles) {
      console.log('❌ Invalid JWT token: Missing required fields.');
      throw new UnauthorizedException('Invalid JWT token');
    }

    console.log('✅ Token is valid, returning user data:', {
      userId: payload.sub,
      email: payload.email,
      activeRole: payload.activeRole,
      availableRoles: payload.availableRoles,
    });

    return {
      userId: payload.sub,
      email: payload.email,
      activeRole: payload.activeRole as UserRole,
      availableRoles: payload.availableRoles as UserRole[],
    };
  }
}
