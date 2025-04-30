import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CompanyProfile } from '../profile/schemas/company-profile.schema';
import { UserRole } from 'src/enums/user-role.enum';
import { PersonProfile } from '../profile/schemas/person-profile.schema';
export declare class UserService {
    private userModel;
    private companyProfileModel;
    private personProfileModel;
    constructor(userModel: Model<UserDocument>, companyProfileModel: Model<CompanyProfile>, personProfileModel: Model<PersonProfile>);
    createUser(payload: CreateUserDto): Promise<UserDocument>;
    validateUser(email: string, password: string): Promise<UserDocument | null>;
    findById(userId: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    createWithProvider(data: {
        email: string;
        provider: string;
        providerId: string;
        profilePicture?: string;
    }): Promise<UserDocument>;
    getAvailableRoles(userId: string): Promise<UserRole[]>;
}
