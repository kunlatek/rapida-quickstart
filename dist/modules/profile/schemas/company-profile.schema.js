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
exports.CompanyProfileSchema = exports.CompanyProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CompanyProfile = class CompanyProfile {
};
exports.CompanyProfile = CompanyProfile;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "cnpj", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], CompanyProfile.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "legalNature", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "companyDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "logoImage", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], CompanyProfile.prototype, "companyImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], CompanyProfile.prototype, "tagId", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            personId: { type: mongoose_2.Types.ObjectId, ref: 'Person', required: true },
        },
    ]),
    __metadata("design:type", Array)
], CompanyProfile.prototype, "partners", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            contactType: { type: String },
            contactValue: { type: String },
            contactComplement: { type: String },
        },
    ]),
    __metadata("design:type", Array)
], CompanyProfile.prototype, "contacts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneCepBrasilApi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneStreet", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneComplement", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneCity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressOneState", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoCepBrasilApi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoStreet", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoComplement", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoCity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CompanyProfile.prototype, "addressTwoState", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            bankName: String,
            bankBranch: String,
            bankAccount: String,
            bankAccountType: String,
        },
    }),
    __metadata("design:type", Object)
], CompanyProfile.prototype, "bankDataOne", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            bankName: String,
            bankBranch: String,
            bankAccount: String,
            bankAccountType: String,
        },
    }),
    __metadata("design:type", Object)
], CompanyProfile.prototype, "bankDataTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            filesDescription: { type: String, required: true },
            relatedFilesFiles: { type: String, required: true },
            relatedFilesDateDay: { type: Number, required: true },
            relatedFilesDateMonth: { type: Number, required: true },
            relatedFilesDateYear: { type: Number, required: true },
        },
    ]),
    __metadata("design:type", Array)
], CompanyProfile.prototype, "relatedFiles", void 0);
exports.CompanyProfile = CompanyProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CompanyProfile);
exports.CompanyProfileSchema = mongoose_1.SchemaFactory.createForClass(CompanyProfile);
//# sourceMappingURL=company-profile.schema.js.map