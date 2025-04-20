import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonProfile } from './schemas/person-profile.schema';
import {
  CreatePersonProfileDto,
  UpdatePersonProfileDto,
  PersonProfileFilterDto,
} from './dto/person-profile.dto';
import { ErrorService } from '../../common/services/error.service';
import { AuthService } from '../auth/auth.service';
import { UserRole } from 'src/enums/user-role.enum';
import { ErrorCode } from 'src/common/constants/error-code.enum';

@Injectable()
export class PersonProfileService {
  constructor(
    @InjectModel(PersonProfile.name)
    private readonly personProfileModel: Model<PersonProfile>,
    private readonly errorService: ErrorService,
    private readonly authService: AuthService,
  ) {}

  async createProfile(dto: CreatePersonProfileDto) {
    const existing = await this.personProfileModel.findOne({
      userId: dto.userId,
    });
    if (existing) {
      throw new ConflictException('User already has a person profile');
    }

    const age = this.calculateAge(dto.birthday);
    if (age < 18) {
      throw new BadRequestException(
        this.errorService.getErrorMessage(ErrorCode.MINIMUM_AGE_REQUIRED),
      );
    }

    const profile = await this.personProfileModel.create(dto);
    const token = await this.authService.issueTokenWithRole(
      dto.userId,
      UserRole.PERSON,
    );

    return { profile, ...token };
  }

  async findAll(
    filterDto: PersonProfileFilterDto,
  ): Promise<{ data: PersonProfile[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const query: any = {};

    for (const key of Object.keys(filters)) {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: 'i' };
      }
    }

    const total = await this.personProfileModel.countDocuments(query);
    const data = await this.personProfileModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async findProfileById(id: string) {
    const profile = await this.personProfileModel.findById(id);
    if (!profile) throw new NotFoundException('Person profile not found');
    return profile;
  }

  async findProfileByUserId(userId: string) {
    const profile = await this.personProfileModel.findOne({ userId }).exec();
    if (!profile) throw new NotFoundException('Person profile not found');
    return profile;
  }

  async updateProfile(id: string, dto: UpdatePersonProfileDto, userId: string) {
    const profile = await this.personProfileModel.findById(id);
    if (!profile) throw new NotFoundException('Person profile not found');

    if (profile.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this profile',
      );
    }

    if (dto.birthday) {
      const age = this.calculateAge(dto.birthday);
      if (age < 18) {
        throw new BadRequestException(
          this.errorService.getErrorMessage(ErrorCode.MINIMUM_AGE_REQUIRED),
        );
      }
    }

    return await this.personProfileModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async deleteProfile(id: string, userId: string) {
    const profile = await this.personProfileModel.findById(id);
    if (!profile) throw new NotFoundException('Person profile not found');

    if (profile.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this profile',
      );
    }

    await this.personProfileModel.findByIdAndDelete(id);
    return { message: 'Person profile deleted successfully' };
  }

  private calculateAge(date: Date): number {
    const today = new Date();
    const birth = new Date(date);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
