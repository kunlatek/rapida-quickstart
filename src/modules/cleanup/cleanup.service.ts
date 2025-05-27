import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { PersonProfile } from "../profile/schemas/person-profile.schema";
import { CompanyProfile } from "../profile/schemas/company-profile.schema";

@Injectable()
export class CleanupService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PersonProfile.name)
    private personProfileModel: Model<PersonProfile>,
    @InjectModel(CompanyProfile.name)
    private companyProfileModel: Model<CompanyProfile>
  ) {}

  async removeTestUser(email: string) {
    // Find the user with the specified email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const userId = user._id.toString();

    // Delete all related person profiles
    const deletedPersonProfiles = await this.personProfileModel.deleteMany({
      userId,
    });

    // Delete all related company profiles
    const deletedCompanyProfiles = await this.companyProfileModel.deleteMany({
      userId,
    });

    // Delete the user
    await this.userModel.findByIdAndDelete(user._id);

    return {
      message: `User ${email} removed successfully`,
      details: {
        userId,
        deletedPersonProfiles: deletedPersonProfiles.deletedCount,
        deletedCompanyProfiles: deletedCompanyProfiles.deletedCount,
      },
    };
  }
}
