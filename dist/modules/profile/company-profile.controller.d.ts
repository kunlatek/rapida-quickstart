import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileFilterDto, CreateCompanyProfileDto, UpdateCompanyProfileDto } from './dto/company-profile.dto';
import { ErrorService } from '../../common/services/error.service';
import { CompanyProfile } from './schemas/company-profile.schema';
export declare class CompanyProfileController {
    private readonly companyProfileService;
    private readonly errorService;
    constructor(companyProfileService: CompanyProfileService, errorService: ErrorService);
    create(dto: CreateCompanyProfileDto, req: any): Promise<{
        access_token: string;
    }>;
    findAll(filterDto: CompanyProfileFilterDto): Promise<{
        data: CompanyProfile[];
        total: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, CompanyProfile> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findByUserId(userId: string, req: any): Promise<import("mongoose").Document<unknown, {}, CompanyProfile> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, dto: UpdateCompanyProfileDto, req: any): Promise<import("mongoose").Document<unknown, {}, CompanyProfile> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
