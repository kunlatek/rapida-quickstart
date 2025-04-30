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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("./dto/login.dto");
const google_login_dto_1 = require("./dto/google-login.dto");
const apple_login_dto_1 = require("./dto/apple-login.dto");
const user_role_enum_1 = require("../../enums/user-role.enum");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleLoginWithToken(dto) {
        return this.authService.googleLogin(dto.idToken);
    }
    async appleLoginWithToken(dto) {
        return this.authService.appleLogin(dto.idToken);
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async switchRole(req, role) {
        return this.authService.switchActiveRole(req.user, role);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('google/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login via Google using ID Token' }),
    (0, swagger_1.ApiBody)({ type: google_login_dto_1.GoogleLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT access token after validating Google ID Token',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_login_dto_1.GoogleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLoginWithToken", null);
__decorate([
    (0, common_1.Post)('apple/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login via Apple using ID Token' }),
    (0, swagger_1.ApiBody)({ type: apple_login_dto_1.AppleLoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT access token after validating Apple ID Token',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apple_login_dto_1.AppleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "appleLoginWithToken", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('email')),
    (0, swagger_1.ApiOperation)({
        summary: 'Local login with email/password',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns JWT access token on successful login with available roles',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('switch-role'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('jwt'),
    (0, swagger_1.ApiOperation)({ summary: 'Switch active role and receive new JWT token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                role: {
                    type: 'string',
                    enum: Object.values(user_role_enum_1.UserRole),
                    example: 'admin',
                },
            },
            required: ['role'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a new JWT access token with the selected role active',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchRole", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map