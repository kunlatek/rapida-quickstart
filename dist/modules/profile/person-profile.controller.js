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
exports.PersonProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../common/guards/roles.guard");
const active_role_guard_1 = require("../../common/guards/active-role.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_role_enum_1 = require("../../enums/user-role.enum");
const person_profile_dto_1 = require("./dto/person-profile.dto");
const person_profile_service_1 = require("./person-profile.service");
let PersonProfileController = class PersonProfileController {
    constructor(personProfileService) {
        this.personProfileService = personProfileService;
    }
    async create(req, createPersonProfileDto) {
        if (!req.user?.userId) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        createPersonProfileDto.userId = req.user.userId;
        return this.personProfileService.createProfile(createPersonProfileDto);
    }
    async findAll(filterDto) {
        return this.personProfileService.findAll(filterDto);
    }
    async getById(id, req) {
        if (!req.user?.userId) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return this.personProfileService.findProfileById(id);
    }
    async findByUserId(userId, req) {
        if (!req.user?.userId) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return this.personProfileService.findProfileByUserId(userId);
    }
    async update(id, updateDto, req) {
        if (!req.user?.userId) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return this.personProfileService.updateProfile(id, updateDto, req.user.userId);
    }
    async delete(id, req) {
        if (!req.user?.userId) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return this.personProfileService.deleteProfile(id, req.user.userId);
    }
};
exports.PersonProfileController = PersonProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a person profile' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Person profile created successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, person_profile_dto_1.CreatePersonProfileDto]),
    __metadata("design:returntype", Promise)
], PersonProfileController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all person profiles with filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all person profiles' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), active_role_guard_1.ActiveRoleGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [person_profile_dto_1.PersonProfileFilterDto]),
    __metadata("design:returntype", Promise)
], PersonProfileController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a person profile by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Person profile found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonProfileController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a person profile by userId' }),
    (0, swagger_1.ApiParam)({ name: 'userId', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Person profile found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonProfileController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a person profile' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, person_profile_dto_1.UpdatePersonProfileDto, Object]),
    __metadata("design:returntype", Promise)
], PersonProfileController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a person profile' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonProfileController.prototype, "delete", null);
exports.PersonProfileController = PersonProfileController = __decorate([
    (0, swagger_1.ApiTags)('person-profiles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('person-profiles'),
    __metadata("design:paramtypes", [person_profile_service_1.PersonProfileService])
], PersonProfileController);
//# sourceMappingURL=person-profile.controller.js.map