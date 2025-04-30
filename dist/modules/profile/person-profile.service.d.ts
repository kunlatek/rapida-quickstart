import { Model } from 'mongoose';
import { PersonProfile } from './schemas/person-profile.schema';
import { CreatePersonProfileDto, UpdatePersonProfileDto, PersonProfileFilterDto } from './dto/person-profile.dto';
import { ErrorService } from '../../common/services/error.service';
import { AuthService } from '../auth/auth.service';
export declare class PersonProfileService {
    private readonly personProfileModel;
    private readonly errorService;
    private readonly authService;
    constructor(personProfileModel: Model<PersonProfile>, errorService: ErrorService, authService: AuthService);
    createProfile(dto: CreatePersonProfileDto): Promise<{
        access_token: string;
        profile: import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    findAll(filterDto: PersonProfileFilterDto): Promise<{
        data: PersonProfile[];
        total: number;
    }>;
    findProfileById(id: string): Promise<import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findProfileByUserId(userId: string): Promise<import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateProfile(id: string, dto: UpdatePersonProfileDto, userId: string): Promise<import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteProfile(id: string, userId: string): Promise<{
        message: string;
    }>;
    private calculateAge;
}
