import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CompanyProfile } from '../profile/schemas/company-profile.schema';
import { UserRole } from 'src/enums/user-role.enum';
import { PersonProfile } from '../profile/schemas/person-profile.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CompanyProfile.name)
    private companyProfileModel: Model<CompanyProfile>,
    @InjectModel(PersonProfile.name)
    private personProfileModel: Model<PersonProfile>,
  ) {}

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
}
