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
exports.CompanyProfileFilterDto = exports.UpdateCompanyProfileDto = exports.CreateCompanyProfileDto = exports.BankDataDto = exports.RelatedFileDto = exports.ContactDto = exports.PartnerDto = exports.AccountType = exports.AddressType = exports.ContactType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var ContactType;
(function (ContactType) {
    ContactType["MOBILE"] = "mobile";
    ContactType["EMAIL"] = "email";
    ContactType["WEBSITE"] = "website";
    ContactType["LINKEDIN"] = "linkedin";
    ContactType["INSTAGRAM"] = "instagram";
    ContactType["FACEBOOK"] = "facebook";
})(ContactType || (exports.ContactType = ContactType = {}));
var AddressType;
(function (AddressType) {
    AddressType["RESIDENTIAL"] = "residential";
    AddressType["COMMERCIAL"] = "commercial";
})(AddressType || (exports.AddressType = AddressType = {}));
var AccountType;
(function (AccountType) {
    AccountType["CURRENT"] = "currentAccount";
    AccountType["SAVINGS"] = "savingsAccount";
})(AccountType || (exports.AccountType = AccountType = {}));
class PartnerDto {
}
exports.PartnerDto = PartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'personId',
        description: 'Reference to person',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartnerDto.prototype, "personId", void 0);
class ContactDto {
}
exports.ContactDto = ContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ContactType, example: ContactType.MOBILE }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(ContactType),
    __metadata("design:type", String)
], ContactDto.prototype, "contactType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+55 11 91234-5678' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "contactValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WhatsApp' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactDto.prototype, "contactComplement", void 0);
class RelatedFileDto {
}
exports.RelatedFileDto = RelatedFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Descrição do arquivo' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RelatedFileDto.prototype, "filesDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'arquivo.pdf' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RelatedFileDto.prototype, "relatedFilesFiles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RelatedFileDto.prototype, "relatedFilesDateDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RelatedFileDto.prototype, "relatedFilesDateMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2023 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RelatedFileDto.prototype, "relatedFilesDateYear", void 0);
class BankDataDto {
}
exports.BankDataDto = BankDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '341' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1234' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankBranch", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '56789-0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AccountType, example: AccountType.CURRENT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AccountType),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankAccountType", void 0);
class CreateCompanyProfileDto {
}
exports.CreateCompanyProfileDto = CreateCompanyProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'userId', readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12.345.678/0001-90' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Empresa ABC LTDA' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC Negócios' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2001-01-01',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCompanyProfileDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sociedade Limitada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "legalNature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Empresa especializada em...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "companyDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'logo.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "logoImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['foto1.png', 'foto2.png'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCompanyProfileDto.prototype, "companyImages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Related tag IDs',
        example: ['tagId1', 'tagId2'],
        isArray: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCompanyProfileDto.prototype, "tagId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PartnerDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => PartnerDto),
    __metadata("design:type", Array)
], CreateCompanyProfileDto.prototype, "partners", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ContactDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => ContactDto),
    __metadata("design:type", Array)
], CreateCompanyProfileDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01001-000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneCepBrasilApi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AddressType, example: AddressType.COMMERCIAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Av. Paulista' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneStreet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Fundos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneComplement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'São Paulo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SP' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressOneState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '02002-000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoCepBrasilApi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: AddressType, example: AddressType.RESIDENTIAL }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rua das Flores' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoStreet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '222' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Casa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoComplement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Campinas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SP' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "addressTwoState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BankDataDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => BankDataDto),
    __metadata("design:type", BankDataDto)
], CreateCompanyProfileDto.prototype, "bankDataOne", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BankDataDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => BankDataDto),
    __metadata("design:type", BankDataDto)
], CreateCompanyProfileDto.prototype, "bankDataTwo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [RelatedFileDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => RelatedFileDto),
    __metadata("design:type", Array)
], CreateCompanyProfileDto.prototype, "relatedFiles", void 0);
class UpdateCompanyProfileDto extends (0, swagger_1.PartialType)(CreateCompanyProfileDto) {
}
exports.UpdateCompanyProfileDto = UpdateCompanyProfileDto;
class CompanyProfileFilterDto {
}
exports.CompanyProfileFilterDto = CompanyProfileFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CompanyProfileFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CompanyProfileFilterDto.prototype, "limit", void 0);
//# sourceMappingURL=company-profile.dto.js.map