import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { Invite, InviteSchema } from './invite.schema';
import { ProfileModule } from '../profile/profile.module';
import { CommonModule } from '../../common/common.module';
import { EmailService } from './services/email.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }]),
    ProfileModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [InviteController],
  providers: [InviteService, EmailService],
  exports: [InviteService],
})
export class InviteModule {} 