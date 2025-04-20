import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileSchema } from './schemas/company-profile.schema';
import { PersonProfileController } from './person-profile.controller';
import { PersonProfileService } from './person-profile.service';
import { PersonProfileSchema } from './schemas/person-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: 'PersonProfile', schema: PersonProfileSchema },
      { name: 'CompanyProfile', schema: CompanyProfileSchema },
    ]),
    CommonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [CompanyProfileController, PersonProfileController],
  providers: [CompanyProfileService, PersonProfileService],
})
export class ProfileModule {}
