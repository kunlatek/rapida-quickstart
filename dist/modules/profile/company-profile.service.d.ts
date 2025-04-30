import { Model } from 'mongoose';
import { CompanyProfile } from './schemas/company-profile.schema';
import { CompanyProfileFilterDto, CreateCompanyProfileDto, UpdateCompanyProfileDto } from './dto/company-profile.dto';
import { ErrorService } from '../../common/services/error.service';
import { AuthService } from '../auth/auth.service';
export declare class CompanyProfileService {
    private readonly companyProfileModel;
    private readonly errorService;
    private readonly authService;
    constructor(companyProfileModel: Model<CompanyProfile>, errorService: ErrorService, authService: AuthService);
    createProfile(createCompanyProfileDto: CreateCompanyProfileDto): Promise<{
        access_token: string;
    }>;
    findAll(filterDto: CompanyProfileFilterDto): Promise<{
        data: CompanyProfile[];
        total: number;
    }>;
    findProfileById(id: string): Promise<import("mongoose").Document<unknown, {}, CompanyProfile> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findProfileByUserId(userId: string): Promise<import("mongoose").Document<unknown, {}, CompanyProfile> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateProfile(id: string, updateCompanyProfileDto: UpdateCompanyProfileDto, userId: string): Promise<import("mongoose").Document<unknown, {}, CompanyProfile> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteProfile(id: string, userId: string): Promise<{
        message: string;
    }>;
}
