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
exports.CompanyProfileController = void 0;
const common_1 = require("@nestjs/common");
const company_profile_service_1 = require("./company-profile.service");
const company_profile_dto_1 = require("./dto/company-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const error_service_1 = require("../../common/services/error.service");
const error_code_enum_1 = require("../../common/constants/error-code.enum");
const active_role_guard_1 = require("../../common/guards/active-role.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_role_enum_1 = require("../../enums/user-role.enum");
let CompanyProfileController = class CompanyProfileController {
    constructor(companyProfileService, errorService) {
        this.companyProfileService = companyProfileService;
        this.errorService = errorService;
    }
    async create(dto, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
        }
        dto.userId = req.user.userId;
        return this.companyProfileService.createProfile(dto);
    }
    async findAll(filterDto) {
        return this.companyProfileService.findAll(filterDto);
    }
    async findById(id) {
        return this.companyProfileService.findProfileById(id);
    }
    async findByUserId(userId, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return this.companyProfileService.findProfileByUserId(userId);
    }
    async update(id, dto, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
        }
        return this.companyProfileService.updateProfile(id, dto, req.user.userId);
    }
    async remove(id, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
        }
        return this.companyProfileService.deleteProfile(id, req.user.userId);
    }
};
exports.CompanyProfileController = CompanyProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a company profile' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Profile created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_profile_dto_1.CreateCompanyProfileDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all company profiles with filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all company profiles' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), active_role_guard_1.ActiveRoleGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_profile_dto_1.CompanyProfileFilterDto]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get a company profile by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a company profile by userId' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company profile found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company profile not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a company profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_profile_dto_1.UpdateCompanyProfileDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID' }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a company profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "remove", null);
exports.CompanyProfileController = CompanyProfileController = __decorate([
    (0, swagger_1.ApiTags)('company-profiles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('company-profiles'),
    __metadata("design:paramtypes", [company_profile_service_1.CompanyProfileService,
        error_service_1.ErrorService])
], CompanyProfileController);
//# sourceMappingURL=company-profile.controller.js.map