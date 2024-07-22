import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { Invitation } from 'src/permeson/invitation/invitation.entity';
import { Role } from 'src/permeson/role/role.entity';
import { Profile } from 'src/permeson/profile/profile.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User, Invitation, Role, Profile]),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService],
})
export class AutentikigoModule {}
