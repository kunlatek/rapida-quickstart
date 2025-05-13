import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import {
  CompanyProfile,
  CompanyProfileSchema,
} from '../profile/schemas/company-profile.schema';
import {
  PersonProfile,
  PersonProfileSchema,
} from '../profile/schemas/person-profile.schema';
import { CommonModule } from 'src/common/common.module';
import { SmsCodeModule } from '../smsCode/sms-code.module';
import { InvitationModule } from '../invitation/invitation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: CompanyProfile.name, schema: CompanyProfileSchema },
    ]),
    MongooseModule.forFeature([
      { name: PersonProfile.name, schema: PersonProfileSchema },
    ]),
    CommonModule,
    SmsCodeModule,
    InvitationModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
