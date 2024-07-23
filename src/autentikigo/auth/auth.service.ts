import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { FormUserDto } from '../user/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from 'src/permeson/invitation/invitation.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/permeson/role/role.entity';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  FormSignupDto,
  HttpAuthResponseDto,
} from './auth.dto';
import { Profile } from 'src/permeson/profile/profile.entity';
import {
  generateMailTemplate,
  sendEmail,
} from 'src/services/email-service/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async register(user: FormSignupDto): Promise<void> {
    await this.usersService.create(user);
  }

  async registerWithInvitation(
    user: FormSignupDto,
  ): Promise<HttpAuthResponseDto> {
    const decodedToken = this.jwtService.verify(user.invitationToken);
    if (!decodedToken) throw new HttpException('Invalid invitation token', 400);

    const invitationId = decodedToken.invitationId;
    const invitation = await this.invitationRepository.findOneBy({
      email: user.email,
    });

    if (!invitation || invitation?._id.toString() !== invitationId) {
      throw new HttpException('Invalid invitation', 400);
    }

    await this.usersService.create(user);
    const userCreated = await this.usersService.findByEmail(user.email);

    await Promise.all([
      this.roleRepository.save({
        userId: userCreated._id.toString(),
        permissionId: invitation.permission,
      }),
      this.invitationRepository.update(invitation._id.toString(), {
        accepted: true,
      }),
      this.profileRepository.save({
        userId: userCreated._id.toString(),
        picture: user.pictureProfile,
        name: user.name,
      }),
    ]);

    return {
      token: this.jwtService.sign(
        { user: userCreated._id },
        { secret: process.env.JWT_SECRET },
      ),
      userId: userCreated._id.toString(),
    };
  }

  async login(user: FormUserDto): Promise<HttpAuthResponseDto> {
    const { email, password } = user;
    const userFound = await this.usersService.findByEmail(email);

    if (!userFound) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await compare(password, userFound.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 401);
    }

    return {
      token: this.jwtService.sign(
        { user: userFound._id },
        { secret: process.env.JWT_SECRET },
      ),
      userId: userFound._id.toString(),
    };
  }

  async sendForgotPasswordEmail(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) throw new HttpException('User not found', 404);

    const token = this.jwtService.sign(
      { user: user._id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );

    await sendEmail({
      to: user.email,
      subject: 'Forgot Password',
      html: generateMailTemplate('forgot-pass-email', {
        app: process.env.APP_NAME,
        baseUrl: process.env.FRONTEND_URL,
        changePasswordToken: token,
      }),
    });
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const decodedToken = this.jwtService.verify(
      changePasswordDto.changePasswordToken,
    );
    if (!decodedToken) throw new HttpException('Invalid token', 400);

    const user = await this.usersService.findById(decodedToken.user);
    if (!user) throw new HttpException('User not found', 404);

    await this.usersService.updatePassword(
      user._id.toString(),
      changePasswordDto.newPassword,
    );
  }
}
