import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import { ErrorService } from '../../common/services/error.service';
import { ErrorCode } from '../../common/constants/error-code.enum';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { UserRole } from 'src/enums/user-role.enum';
import { SignupDto } from './dto/signup.dto';
import { InvitationService } from '../invitation/invitation.service';
import { EmailService } from './services/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
/**
 * Service responsible for authentication and JWT token generation.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly errorService: ErrorService,
    private readonly invitationService: InvitationService,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Validates the user by comparing email/password.
   * Throws UnauthorizedException on invalid credentials.
   */
  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.INVALID_CREDENTIALS),
      );
    }

    return user;
  }

  /**
   * Generates a JWT for the authenticated user.
   * Checks for available roles and returns token with them.
   * The activeRole is not set at login time.
   */
  async login(user: UserDocument) {
    const availableRoles = await this.userService.getAvailableRoles(user._id);

    const payload = {
      sub: user._id,
      email: user.email,
      activeRole: availableRoles.length === 1 ? availableRoles[0] : null,
      availableRoles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Issues a new JWT for a user after creating a profile.
   * Sets the new role as activeRole and includes it in availableRoles.
   */
  async issueTokenWithRole(
    userId: string,
    newRole: UserRole,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    const availableRoles = await this.userService.getAvailableRoles(userId);
    const updatedRoles = Array.from(new Set([...availableRoles, newRole]));

    const payload = {
      sub: user._id,
      email: user.email,
      activeRole: newRole,
      availableRoles: updatedRoles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Switches the active role for the authenticated user and issues a new JWT.
   */
  async switchActiveRole(
    user: any,
    newRole: UserRole,
  ): Promise<{ access_token: string }> {
    if (!user.availableRoles.includes(newRole)) {
      throw new ForbiddenException(`You cannot switch to role: ${newRole}`);
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      activeRole: newRole,
      availableRoles: user.availableRoles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Validates a Google ID token, finds or creates a user, and returns a JWT.
   */
  async googleLogin(idToken: string) {
    try {
      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );

      const { email, sub: providerId, picture } = response.data;

      if (!email || !providerId) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
        );
      }

      let user = await this.userService.findByEmail(email);

      if (!user) {
        user = await this.userService.createWithProvider({
          email,
          provider: 'google',
          providerId,
          profilePicture: picture,
        });
      }

      return this.login(user);
    } catch (error) {
      console.error('❌ Failed to validate Google ID token:', error.message);

      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.INVALID_CREDENTIALS),
      );
    }
  }

  /**
   * Validates an Apple ID token, finds or creates a user, and returns a JWT.
   */
  async appleLogin(idToken: string) {
    try {
      const decoded: any = jwt.decode(idToken, { complete: true });
      const kid = decoded?.header?.kid;

      if (!kid) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCode.INVALID_CREDENTIALS),
        );
      }

      const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
      });

      const key = await client.getSigningKey(kid);
      const publicKey = key.getPublicKey();

      const payload: any = jwt.verify(idToken, publicKey, {
        algorithms: ['RS256'],
      });

      const { email, sub: providerId } = payload;

      if (!email || !providerId) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
        );
      }

      let user = await this.userService.findByEmail(email);

      if (!user) {
        user = await this.userService.createWithProvider({
          email,
          provider: 'apple',
          providerId,
        });
      }

      return this.login(user);
    } catch (error) {
      console.error('❌ Failed to validate Apple ID token:', error.message);

      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.INVALID_CREDENTIALS),
      );
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const payload = this.jwtService.verify(signupDto.invitationToken);

      if (payload.email !== signupDto.email) {
        throw new BadRequestException('Email não corresponde ao convite');
      }

      const user = await this.userService.createUser({
        email: signupDto.email,
        password: signupDto.password,
      });

      await this.invitationService.acceptInvitation(payload.invitationId);

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email
      });

      return {
        user,
        token,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token de convite inválido');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token de convite expirado');
      }
      throw error;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    try {
      await this.emailService.sendForgotPasswordEmail(email);
    } catch (error) {
      throw new BadRequestException('Erro ao enviar email de recuperação de senha');
    }

    return {
      message: 'Email de recuperação de senha enviado com sucesso',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const decoded = this.jwtService.verify(token);

    const user = await this.userService.findByEmail(decoded.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return {
      message: 'Senha resetada com sucesso',
    };
  }
}
