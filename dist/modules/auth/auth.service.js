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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const error_service_1 = require("../../common/services/error.service");
const error_code_enum_1 = require("../../common/constants/error-code.enum");
const axios_1 = require("axios");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
let AuthService = class AuthService {
    constructor(userService, jwtService, errorService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.errorService = errorService;
    }
    async validateUser(email, password) {
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.INVALID_CREDENTIALS));
        }
        return user;
    }
    async login(user) {
        const availableRoles = await this.userService.getAvailableRoles(user._id);
        const payload = {
            sub: user._id,
            email: user.email,
            activeRole: availableRoles.length === 1 ? availableRoles[0] : null,
            availableRoles,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async issueTokenWithRole(userId, newRole) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
        }
        const availableRoles = await this.userService.getAvailableRoles(userId);
        const updatedRoles = Array.from(new Set([...availableRoles, newRole]));
        const payload = {
            sub: user._id,
            email: user.email,
            activeRole: newRole,
            availableRoles: updatedRoles,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async switchActiveRole(user, newRole) {
        if (!user.availableRoles.includes(newRole)) {
            throw new common_1.ForbiddenException(`You cannot switch to role: ${newRole}`);
        }
        const payload = {
            sub: user.userId,
            email: user.email,
            activeRole: newRole,
            availableRoles: user.availableRoles,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async googleLogin(idToken) {
        try {
            const response = await axios_1.default.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
            const { email, sub: providerId, picture } = response.data;
            if (!email || !providerId) {
                throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
            }
            let user = await this.userService.findByEmail(email);
            if (!user) {
                user = await this.userService.createWithProvider({
                    email,
                    provider: 'google',
                    providerId,
                    profilePicture: picture,
                });
            }
            return this.login(user);
        }
        catch (error) {
            console.error('❌ Failed to validate Google ID token:', error.message);
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.INVALID_CREDENTIALS));
        }
    }
    async appleLogin(idToken) {
        try {
            const decoded = jwt.decode(idToken, { complete: true });
            const kid = decoded?.header?.kid;
            if (!kid) {
                throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.INVALID_CREDENTIALS));
            }
            const client = jwksClient({
                jwksUri: 'https://appleid.apple.com/auth/keys',
            });
            const key = await client.getSigningKey(kid);
            const publicKey = key.getPublicKey();
            const payload = jwt.verify(idToken, publicKey, {
                algorithms: ['RS256'],
            });
            const { email, sub: providerId } = payload;
            if (!email || !providerId) {
                throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.UNAUTHORIZED));
            }
            let user = await this.userService.findByEmail(email);
            if (!user) {
                user = await this.userService.createWithProvider({
                    email,
                    provider: 'apple',
                    providerId,
                });
            }
            return this.login(user);
        }
        catch (error) {
            console.error('❌ Failed to validate Apple ID token:', error.message);
            throw new common_1.UnauthorizedException(this.errorService.getErrorMessage(error_code_enum_1.ErrorCode.INVALID_CREDENTIALS));
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        error_service_1.ErrorService])
], AuthService);
//# sourceMappingURL=auth.service.js.map