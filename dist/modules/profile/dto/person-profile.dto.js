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
exports.PersonProfileFilterDto = exports.UpdatePersonProfileDto = exports.CreatePersonProfileDto = exports.RelatedFileDto = exports.BankDataDto = exports.PersonCourseDto = exports.PersonEducationDto = exports.PersonJobDto = exports.BankAccountType = exports.EducationLevel = exports.MaritalStatus = exports.Gender = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var Gender;
(function (Gender) {
    Gender["MALE"] = "M";
    Gender["FEMALE"] = "F";
    Gender["NEUTRAL"] = "N";
    Gender["OTHER"] = "O";
})(Gender || (exports.Gender = Gender = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["DIVORCED"] = "divorced";
    MaritalStatus["WIDOWED"] = "widowed";
    MaritalStatus["ENGAGED"] = "engaged";
    MaritalStatus["COMMON_LAW"] = "commonLawMarried";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
var EducationLevel;
(function (EducationLevel) {
    EducationLevel["INCOMPLETE_ELEMENTARY"] = "incompleteElementarySchool";
    EducationLevel["COMPLETE_ELEMENTARY"] = "completeElementarySchool";
    EducationLevel["INCOMPLETE_HIGH"] = "incompleteHighSchool";
    EducationLevel["COMPLETE_HIGH"] = "completeHighSchool";
    EducationLevel["INCOMPLETE_HIGHER"] = "incompleteHigherEducation";
    EducationLevel["COMPLETE_HIGHER"] = "completeHigherEducation";
    EducationLevel["POSTGRADUATE"] = "postgraduate";
    EducationLevel["MASTERS"] = "mastersDegree";
    EducationLevel["DOCTORATE"] = "doctorate";
})(EducationLevel || (exports.EducationLevel = EducationLevel = {}));
var BankAccountType;
(function (BankAccountType) {
    BankAccountType["CURRENT"] = "currentAccount";
    BankAccountType["SAVINGS"] = "savingsAccount";
})(BankAccountType || (exports.BankAccountType = BankAccountType = {}));
class PersonJobDto {
}
exports.PersonJobDto = PersonJobDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '60f6f9d3c25e4c0023bdf123',
        description: 'Job ID (referência à entidade Job)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonJobDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        description: 'Month when the person started this job',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PersonJobDto.prototype, "jobStartDateMonth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 2020,
        description: 'Year when the person started this job',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PersonJobDto.prototype, "jobStartDateYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 6,
        description: 'Month when the person finished this job',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PersonJobDto.prototype, "jobFinishDateMonth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 2022,
        description: 'Year when the person finished this job',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PersonJobDto.prototype, "jobFinishDateYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Responsável por atendimento ao cliente.',
        description: 'Description of job responsibilities',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonJobDto.prototype, "jobDescription", void 0);
class PersonEducationDto {
}
exports.PersonEducationDto = PersonEducationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Engenharia Civil',
        description: 'Course name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonEducationDto.prototype, "personEducationCourse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'UFAL',
        description: 'Educational institution',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonEducationDto.prototype, "personEducationInstitution", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2015-01-01',
        description: 'Start date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PersonEducationDto.prototype, "personEducationStartDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2019-12-20',
        description: 'Finish date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PersonEducationDto.prototype, "personEducationFinishDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Curso de graduação completo.',
        description: 'Course description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonEducationDto.prototype, "personEducationDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'certificado.pdf',
        description: 'Certificate file',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonEducationDto.prototype, "personEducationCertificateFile", void 0);
class PersonCourseDto {
}
exports.PersonCourseDto = PersonCourseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Excel Avançado',
        description: 'Course name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonCourseDto.prototype, "personCourseName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Senac', description: 'Institution name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonCourseDto.prototype, "personCourseInstitution", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2022-01-10',
        description: 'Start date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PersonCourseDto.prototype, "personCourseStartDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2022-03-15',
        description: 'Finish date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PersonCourseDto.prototype, "personCourseFinishDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Curso intensivo de Excel com certificação.',
        description: 'Course description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonCourseDto.prototype, "personCourseDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'excel_cert.pdf',
        description: 'Certificate file',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonCourseDto.prototype, "personCourseCertificateFile", void 0);
class BankDataDto {
}
exports.BankDataDto = BankDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '341', description: 'Bank code or name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1234-5', description: 'Branch number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankBranch", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123456-7',
        description: 'Bank account number',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: BankAccountType.CURRENT,
        enum: BankAccountType,
        description: 'Account type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BankAccountType),
    __metadata("design:type", String)
], BankDataDto.prototype, "bankAccountType", void 0);
class RelatedFileDto {
}
exports.RelatedFileDto = RelatedFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Comprovante de residência',
        description: 'Description of the file',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RelatedFileDto.prototype, "filesDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'comprovante.pdf',
        description: 'Filename or path to uploaded file',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RelatedFileDto.prototype, "relatedFilesFiles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 15,
        description: 'Day of file date (1-31)',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RelatedFileDto.prototype, "relatedFilesDateDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 8,
        description: 'Month of file date (1-12)',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RelatedFileDto.prototype, "relatedFilesDateMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2023,
        description: 'Year of file date (four digits)',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RelatedFileDto.prototype, "relatedFilesDateYear", void 0);
class CreatePersonProfileDto {
}
exports.CreatePersonProfileDto = CreatePersonProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '67d1b1b65e1fc7bab385b08c',
        description: 'User ID (extracted from JWT)',
        readOnly: true,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Joana Pessoa', description: 'Full name' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "personName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Joana P.', description: 'Nickname' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "personNickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'F',
        description: 'Gender (M, F, N, O)',
        enum: Gender,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Gender),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-05-20',
        description: 'Birthdate',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePersonProfileDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Solteiro',
        description: 'Marital status',
        enum: MaritalStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MaritalStatus),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Maria da Silva',
        description: "Mother's name",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "motherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'João da Silva',
        description: "Father's name",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "fatherName", void 0);
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
], CreatePersonProfileDto.prototype, "tagId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Descrição longa sobre a pessoa',
        description: 'Personal description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "personDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123.456.789-00', description: 'CPF number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cpf_file.pdf',
        description: 'CPF document file',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "cpfFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MG-12.345.678', description: 'RG number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "rg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'SSP-MG',
        description: 'Issuing authority for RG',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "rgIssuingAuthority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2010-06-15',
        description: 'RG issuance date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePersonProfileDto.prototype, "rgIssuanceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'MG',
        description: 'State that issued the RG',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "rgState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'rg_file.pdf',
        description: 'RG document file',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "rgFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'AA1234567', description: 'Passport number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "passport", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2015-01-01',
        description: 'Passport issuance date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePersonProfileDto.prototype, "passportIssuanceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2025-01-01',
        description: 'Passport expiration date',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePersonProfileDto.prototype, "passportExpirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'passport_file.pdf',
        description: 'Passport file',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "passportFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+55 11 91234-5678',
        description: 'Primary phone number',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "phoneNumberOne", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+55 11 99876-5432',
        description: 'Secondary phone number',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "phoneNumberTwo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'email@primario.com',
        description: 'Primary email address',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "emailOne", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'email@secundario.com',
        description: 'Secondary email address',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "emailTwo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://linkedin.com/in/exemplo',
        description: 'LinkedIn profile',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "linkedin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '@instauser',
        description: 'Instagram handle',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'facebook.com/user',
        description: 'Facebook profile',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '@xhandle',
        description: 'X (Twitter) handle',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '01001-000',
        description: 'Primary address ZIP Code (CEP)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneCepBrasilApi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'residential',
        description: 'Primary address type (residential, commercial)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Avenida Brasil',
        description: 'Primary address street',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneStreet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '410-A',
        description: 'Primary address number',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Ao lado da Igreja São Francisco',
        description: 'Primary address complement',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneComplement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Maceió',
        description: 'Primary address city',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'AL',
        description: 'Primary address state',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressOneState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '01101-000',
        description: 'Secondary address ZIP Code (CEP)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoCepBrasilApi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'commercial',
        description: 'Secondary address type (residential, commercial)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Rua das Flores',
        description: 'Secondary address street',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoStreet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123',
        description: 'Secondary address number',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Fundos',
        description: 'Secondary address complement',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoComplement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Recife',
        description: 'Secondary address city',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'PE',
        description: 'Secondary address state',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "addressTwoState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [PersonJobDto],
        description: 'List of professional experiences',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => PersonJobDto),
    __metadata("design:type", Array)
], CreatePersonProfileDto.prototype, "professions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: EducationLevel.COMPLETE_HIGHER,
        enum: EducationLevel,
        description: 'General education level',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(EducationLevel),
    __metadata("design:type", String)
], CreatePersonProfileDto.prototype, "personEducation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [PersonEducationDto],
        description: 'List of academic formations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => PersonEducationDto),
    __metadata("design:type", Array)
], CreatePersonProfileDto.prototype, "personEducations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [PersonCourseDto],
        description: 'List of complementary courses',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => PersonCourseDto),
    __metadata("design:type", Array)
], CreatePersonProfileDto.prototype, "personCourses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['Português', 'Inglês'],
        isArray: true,
        description: 'Languages spoken by the person',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePersonProfileDto.prototype, "personLanguages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: BankDataDto,
        description: 'First bank account information',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => BankDataDto),
    __metadata("design:type", BankDataDto)
], CreatePersonProfileDto.prototype, "bankDataOne", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: BankDataDto,
        description: 'Second bank account information',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => BankDataDto),
    __metadata("design:type", BankDataDto)
], CreatePersonProfileDto.prototype, "bankDataTwo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [RelatedFileDto],
        description: 'List of related files with metadata',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => RelatedFileDto),
    __metadata("design:type", Array)
], CreatePersonProfileDto.prototype, "relatedFiles", void 0);
class UpdatePersonProfileDto extends (0, swagger_1.PartialType)(CreatePersonProfileDto) {
}
exports.UpdatePersonProfileDto = UpdatePersonProfileDto;
class PersonProfileFilterDto {
}
exports.PersonProfileFilterDto = PersonProfileFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PersonProfileFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of items per page', example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PersonProfileFilterDto.prototype, "limit", void 0);
//# sourceMappingURL=person-profile.dto.js.map