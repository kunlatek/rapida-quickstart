import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyProfile } from './schemas/company-profile.schema';
import {
  CompanyProfileFilterDto,
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from './dto/company-profile.dto';
import { ErrorService } from '../../common/services/error.service';
import { ErrorCode } from '../../common/constants/error-code.enum';
import { AuthService } from '../auth/auth.service';
import { UserRole } from 'src/enums/user-role.enum';

/**
 * Service responsible for managing company profiles.
 * Includes creation, retrieval, update, and deletion functionalities.
 */
@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectModel(CompanyProfile.name)
    private readonly companyProfileModel: Model<CompanyProfile>,
    private readonly errorService: ErrorService,
    private readonly authService: AuthService,
  ) {}

  async createProfile(createCompanyProfileDto: CreateCompanyProfileDto) {
    console.log(
      '🔹 Creating company profile for user:',
      createCompanyProfileDto.userId,
    );

    const existingProfile = await this.companyProfileModel.findOne({
      userId: createCompanyProfileDto.userId,
    });

    if (existingProfile) {
      throw new ConflictException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_ALREADY_EXISTS),
      );
    }

    await this.companyProfileModel.create(createCompanyProfileDto);

    const token = await this.authService.issueTokenWithRole(
      createCompanyProfileDto.userId,
      UserRole.COMPANY,
    );

    return token;
  }

  /**
   * Retrieves all company profiles with filtering and pagination
   */
  async findAll(
    filterDto: CompanyProfileFilterDto,
  ): Promise<{ data: CompanyProfile[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const query: any = {};

    // Apply filters dynamically
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: 'i' }; // Case-insensitive search
      }
    });

    const total = await this.companyProfileModel.countDocuments(query);
    const data = await this.companyProfileModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findProfileById(id: string) {
    const profile = await this.companyProfileModel.findById(id);
    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }
    return profile;
  }

  async findProfileByUserId(userId: string) {
    const profile = await this.companyProfileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }
    return profile;
  }

  async updateProfile(
    id: string,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
    userId: string,
  ) {
    const profile = await this.companyProfileModel.findById(id);

    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }

    if (profile.userId.toString() !== userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    return await this.companyProfileModel.findByIdAndUpdate(
      id,
      updateCompanyProfileDto,
      { new: true },
    );
  }

  async deleteProfile(id: string, userId: string) {
    const profile = await this.companyProfileModel.findById(id);

    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }

    if (profile.userId.toString() !== userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    await this.companyProfileModel.findByIdAndDelete(id);
    return { message: 'Company profile deleted successfully' };
  }
}
