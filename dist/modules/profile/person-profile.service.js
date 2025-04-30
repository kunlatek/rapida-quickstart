"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const person_profile_schema_1 = require("./schemas/person-profile.schema");
const error_service_1 = require("../../common/services/error.service");
const auth_service_1 = require("../auth/auth.service");
const user_role_enum_1 = require("../../enums/user-role.enum");
const error_code_enum_1 = require("../../common/constants/error-code.enum");
let PersonProfileService = class PersonProfileService {
    constructor(personProfileModel, errorService, authService) {
        this.personProfileModel = personProfileModel;
        this.errorService = errorService;
        this.authService = authService;
    }
    async createProfile(dto) {
        const existing = await this.personProfileModel.findOne({
            userId: dto.userId,
        });
        if (existing) {
            throw new common_1.ConflictException('User already has a person profile');
        }
        const age = this.calculateAge(dto.birthday);
        if (age < 18) {
            throw new common_1.BadRequestException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.MINIMUM_AGE_REQUIRED));
        }
        const profile = await this.personProfileModel.create(dto);
        const token = await this.authService.issueTokenWithRole(dto.userId, user_role_enum_1.UserRole.PERSON);
        return { profile, ...token };
    }
    async findAll(filterDto) {
        const { page = 1, limit = 10, ...filters } = filterDto;
        const query = {};
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
    async findProfileById(id) {
        const profile = await this.personProfileModel.findById(id);
        if (!profile)
            throw new common_1.NotFoundException('Person profile not found');
        return profile;
    }
    async findProfileByUserId(userId) {
        const profile = await this.personProfileModel.findOne({ userId }).exec();
        if (!profile)
            throw new common_1.NotFoundException('Person profile not found');
        return profile;
    }
    async updateProfile(id, dto, userId) {
        const profile = await this.personProfileModel.findById(id);
        if (!profile)
            throw new common_1.NotFoundException('Person profile not found');
        if (profile.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to update this profile');
        }
        if (dto.birthday) {
            const age = this.calculateAge(dto.birthday);
            if (age < 18) {
                throw new common_1.BadRequestException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.MINIMUM_AGE_REQUIRED));
            }
        }
        return await this.personProfileModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
    }
    async deleteProfile(id, userId) {
        const profile = await this.personProfileModel.findById(id);
        if (!profile)
            throw new common_1.NotFoundException('Person profile not found');
        if (profile.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException('You are not authorized to delete this profile');
        }
        await this.personProfileModel.findByIdAndDelete(id);
        return { message: 'Person profile deleted successfully' };
    }
    calculateAge(date) {
        const today = new Date();
        const birth = new Date(date);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate()))
            age--;
        return age;
    }
};
exports.PersonProfileService = PersonProfileService;
exports.PersonProfileService = PersonProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(person_profile_schema_1.PersonProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        error_service_1.ErrorService,
        auth_service_1.AuthService])
], PersonProfileService);
//# sourceMappingURL=person-profile.service.js.map