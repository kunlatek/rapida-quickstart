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
exports.CompanyProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_profile_schema_1 = require("./schemas/company-profile.schema");
const error_service_1 = require("../../common/services/error.service");
const error_code_enum_1 = require("../../common/constants/error-code.enum");
const auth_service_1 = require("../auth/auth.service");
const user_role_enum_1 = require("../../enums/user-role.enum");
let CompanyProfileService = class CompanyProfileService {
    constructor(companyProfileModel, errorService, authService) {
        this.companyProfileModel = companyProfileModel;
        this.errorService = errorService;
        this.authService = authService;
    }
    async createProfile(createCompanyProfileDto) {
        console.log('🔹 Creating company profile for user:', createCompanyProfileDto.userId);
        const existingProfile = await this.companyProfileModel.findOne({
            userId: createCompanyProfileDto.userId,
        });
        if (existingProfile) {
            throw new common_1.ConflictException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.PROFILE_ALREADY_EXISTS));
        }
        await this.companyProfileModel.create(createCompanyProfileDto);
        const token = await this.authService.issueTokenWithRole(createCompanyProfileDto.userId, user_role_enum_1.UserRole.COMPANY);
        return token;
    }
    async findAll(filterDto) {
        const { page = 1, limit = 10, ...filters } = filterDto;
        const query = {};
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                query[key] = { $regex: filters[key], $options: 'i' };
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
    async findProfileById(id) {
        const profile = await this.companyProfileModel.findById(id);
        if (!profile) {
            throw new common_1.NotFoundException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.PROFILE_NOT_FOUND));
        }
        return profile;
    }
    async findProfileByUserId(userId) {
        const profile = await this.companyProfileModel.findOne({ userId }).exec();
        if (!profile) {
            throw new common_1.NotFoundException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.PROFILE_NOT_FOUND));
        }
        return profile;
    }
    async updateProfile(id, updateCompanyProfileDto, userId) {
        const profile = await this.companyProfileModel.findById(id);
        if (!profile) {
            throw new common_1.NotFoundException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.PROFILE_NOT_FOUND));
        }
        if (profile.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
        }
        return await this.companyProfileModel.findByIdAndUpdate(id, updateCompanyProfileDto, { new: true });
    }
    async deleteProfile(id, userId) {
        const profile = await this.companyProfileModel.findById(id);
        if (!profile) {
            throw new common_1.NotFoundException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.PROFILE_NOT_FOUND));
        }
        if (profile.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
        }
        await this.companyProfileModel.findByIdAndDelete(id);
        return { message: 'Company profile deleted successfully' };
    }
};
exports.CompanyProfileService = CompanyProfileService;
exports.CompanyProfileService = CompanyProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_profile_schema_1.CompanyProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        error_service_1.ErrorService,
        auth_service_1.AuthService])
], CompanyProfileService);
//# sourceMappingURL=company-profile.service.js.map