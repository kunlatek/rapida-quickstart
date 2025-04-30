import { CreatePersonProfileDto, UpdatePersonProfileDto, PersonProfileFilterDto } from './dto/person-profile.dto';
import { PersonProfileService } from './person-profile.service';
import { PersonProfile } from './schemas/person-profile.schema';
export declare class PersonProfileController {
    private readonly personProfileService;
    constructor(personProfileService: PersonProfileService);
    create(req: any, createPersonProfileDto: CreatePersonProfileDto): Promise<{
        access_token: string;
        profile: import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    findAll(filterDto: PersonProfileFilterDto): Promise<{
        data: PersonProfile[];
        total: number;
    }>;
    getById(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findByUserId(userId: string, req: any): Promise<import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateDto: UpdatePersonProfileDto, req: any): Promise<import("mongoose").Document<unknown, {}, PersonProfile> & PersonProfile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
