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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
const company_profile_schema_1 = require("../profile/schemas/company-profile.schema");
const user_role_enum_1 = require("../../enums/user-role.enum");
const person_profile_schema_1 = require("../profile/schemas/person-profile.schema");
let UserService = class UserService {
    constructor(userModel, companyProfileModel, personProfileModel) {
        this.userModel = userModel;
        this.companyProfileModel = companyProfileModel;
        this.personProfileModel = personProfileModel;
    }
    async createUser(payload) {
        const existingUser = await this.userModel.findOne({ email: payload.email });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const newUser = new this.userModel({
            ...payload,
            password: hashedPassword,
        });
        return newUser.save();
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }
        return user;
    }
    async findById(userId) {
        return this.userModel.findById(userId).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async createWithProvider(data) {
        const newUser = new this.userModel({
            email: data.email,
            provider: data.provider,
            providerId: data.providerId,
            profilePicture: data.profilePicture,
        });
        return newUser.save();
    }
    async getAvailableRoles(userId) {
        const roles = [];
        const normalizedUserId = typeof userId === 'string'
            ? userId
            : new mongoose_2.Types.ObjectId(userId).toString();
        const [company, person] = await Promise.all([
            this.companyProfileModel.exists({ userId: normalizedUserId }),
            this.personProfileModel.exists({ userId: normalizedUserId }),
        ]);
        if (company)
            roles.push(user_role_enum_1.UserRole.COMPANY);
        if (person)
            roles.push(user_role_enum_1.UserRole.PERSON);
        return roles;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(company_profile_schema_1.CompanyProfile.name)),
    __param(2, (0, mongoose_1.InjectModel)(person_profile_schema_1.PersonProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map