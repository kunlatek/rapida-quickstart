import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CompanyProfile } from '../profile/schemas/company-profile.schema';
import { UserRole } from 'src/enums/user-role.enum';
import { PersonProfile } from '../profile/schemas/person-profile.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CascadeService } from 'src/common/services/cascade.service';
import { SmsCodeService } from '../smsCode/sms-code.service';

@Injectable()
export class UserService {
  private readonly DAYS_UNTIL_HARD_DELETE = 90;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CompanyProfile.name)
    private companyProfileModel: Model<CompanyProfile>,
    @InjectModel(PersonProfile.name)
    private personProfileModel: Model<PersonProfile>,
    private readonly cascadeService: CascadeService,
    private readonly smsCodeService: SmsCodeService,
  ) { }

  /**
   * Creates a new user, storing the password hashed.
   * Validates if the email already exists.
   */
  async createUser(payload: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: payload.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = new this.userModel({
      ...payload,
      password: hashedPassword,
    });

    return newUser.save();
  }

  /**
   * Finds a user by email and verifies if the password matches.
   * Returns null if it does not match or if user not found.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  /**
   * Utility method to find user by ID.
   */
  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  /**
   * Finds a user by email.
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Creates a user from an external provider (e.g., Google).
   * This skips password validation and stores only provider metadata.
   */
  async createWithProvider(data: {
    email: string;
    provider: string;
    providerId: string;
    profilePicture?: string;
  }): Promise<UserDocument> {
    const newUser = new this.userModel({
      email: data.email,
      provider: data.provider,
      providerId: data.providerId,
      profilePicture: data.profilePicture,
    });

    return newUser.save();
  }

  /**
   * Returns all roles available to a given user based on their associated profiles.
   */
  async getAvailableRoles(userId: string): Promise<UserRole[]> {
    const roles: UserRole[] = [];

    const normalizedUserId =
      typeof userId === 'string'
        ? userId
        : new Types.ObjectId(userId).toString();

    const [company, person] = await Promise.all([
      this.companyProfileModel.exists({ userId: normalizedUserId }),
      this.personProfileModel.exists({ userId: normalizedUserId }),
    ]);

    if (company) roles.push(UserRole.COMPANY);
    if (person) roles.push(UserRole.PERSON);

    return roles;
  }

  async updateUser(id: string, payload: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    Object.assign(user, payload);
    return user.save();
  }

  async softDeleteUser(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }

    user.deletedAt = new Date();
    await user.save();
    
    // Cascade soft delete to all related documents
    await this.cascadeService.cascadeSoftDelete(id);

    // Schedule hard delete after 90 days if user remains soft deleted
    setTimeout(async () => {
      const user = await this.userModel.findById(id);
      if (user?.deletedAt) {
        const daysSinceDelete = Math.floor(
          (Date.now() - user.deletedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceDelete >= this.DAYS_UNTIL_HARD_DELETE) {
          await this.hardDeleteUser(id);
        }
      }
    }, this.DAYS_UNTIL_HARD_DELETE * 24 * 60 * 60 * 1000);
  }

  async hardDeleteUser(id: string): Promise<void> {
    // Cascade hard delete to all related documents first
    await this.cascadeService.cascadeHardDelete(id);

    // Then delete the user
    await this.userModel.findByIdAndDelete(id);
  }

  async restoreUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user || !user.deletedAt) {
      throw new NotFoundException('User not found or is not deleted');
    }

    user.deletedAt = null;
    await user.save();

    // Cascade restore to all related documents
    await this.cascadeService.cascadeRestore(id);

    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }
    return user;
  }

  async findMe(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }
}
