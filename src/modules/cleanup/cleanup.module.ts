import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CleanupController } from "./cleanup.controller";
import { CleanupService } from "./cleanup.service";
import { User, UserSchema } from "../user/schemas/user.schema";
import {
  PersonProfile,
  PersonProfileSchema,
} from "../profile/schemas/person-profile.schema";
import {
  CompanyProfile,
  CompanyProfileSchema,
} from "../profile/schemas/company-profile.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PersonProfile.name, schema: PersonProfileSchema },
      { name: CompanyProfile.name, schema: CompanyProfileSchema },
    ]),
  ],
  controllers: [CleanupController],
  providers: [CleanupService],
})
export class CleanupModule {}
