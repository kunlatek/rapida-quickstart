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
exports.PersonProfileSchema = exports.PersonProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const person_profile_dto_1 = require("../dto/person-profile.dto");
let PersonProfile = class PersonProfile extends mongoose_2.Document {
};
exports.PersonProfile = PersonProfile;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PersonProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PersonProfile.prototype, "personName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "personNickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: person_profile_dto_1.Gender, required: true }),
    __metadata("design:type", String)
], PersonProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], PersonProfile.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: person_profile_dto_1.MaritalStatus }),
    __metadata("design:type", String)
], PersonProfile.prototype, "maritalStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "motherName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "fatherName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], PersonProfile.prototype, "tagId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "personDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "cpf", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "cpfFile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "rg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "rgIssuingAuthority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], PersonProfile.prototype, "rgIssuanceDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "rgState", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "rgFile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "passport", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], PersonProfile.prototype, "passportIssuanceDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], PersonProfile.prototype, "passportExpirationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "passportFile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "phoneNumberOne", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "phoneNumberTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "emailOne", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "emailTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "linkedin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "instagram", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "facebook", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "x", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneCepBrasilApi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneStreet", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneComplement", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneCity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressOneState", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoCepBrasilApi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoStreet", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoComplement", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoCity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PersonProfile.prototype, "addressTwoState", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], PersonProfile.prototype, "professions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: person_profile_dto_1.EducationLevel }),
    __metadata("design:type", String)
], PersonProfile.prototype, "personEducation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], PersonProfile.prototype, "personEducations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], PersonProfile.prototype, "personCourses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], PersonProfile.prototype, "personLanguages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", person_profile_dto_1.BankDataDto)
], PersonProfile.prototype, "bankDataOne", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", person_profile_dto_1.BankDataDto)
], PersonProfile.prototype, "bankDataTwo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], PersonProfile.prototype, "relatedFiles", void 0);
exports.PersonProfile = PersonProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PersonProfile);
exports.PersonProfileSchema = mongoose_1.SchemaFactory.createForClass(PersonProfile);
//# sourceMappingURL=person-profile.schema.js.map