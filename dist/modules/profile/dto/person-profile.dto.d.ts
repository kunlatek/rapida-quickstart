export declare enum Gender {
    MALE = "M",
    FEMALE = "F",
    NEUTRAL = "N",
    OTHER = "O"
}
export declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed",
    ENGAGED = "engaged",
    COMMON_LAW = "commonLawMarried"
}
export declare enum EducationLevel {
    INCOMPLETE_ELEMENTARY = "incompleteElementarySchool",
    COMPLETE_ELEMENTARY = "completeElementarySchool",
    INCOMPLETE_HIGH = "incompleteHighSchool",
    COMPLETE_HIGH = "completeHighSchool",
    INCOMPLETE_HIGHER = "incompleteHigherEducation",
    COMPLETE_HIGHER = "completeHigherEducation",
    POSTGRADUATE = "postgraduate",
    MASTERS = "mastersDegree",
    DOCTORATE = "doctorate"
}
export declare enum BankAccountType {
    CURRENT = "currentAccount",
    SAVINGS = "savingsAccount"
}
export declare class PersonJobDto {
    jobId?: string;
    jobStartDateMonth?: number;
    jobStartDateYear?: number;
    jobFinishDateMonth?: number;
    jobFinishDateYear?: number;
    jobDescription?: string;
}
export declare class PersonEducationDto {
    personEducationCourse?: string;
    personEducationInstitution?: string;
    personEducationStartDate?: Date;
    personEducationFinishDate?: Date;
    personEducationDescription?: string;
    personEducationCertificateFile?: string;
}
export declare class PersonCourseDto {
    personCourseName?: string;
    personCourseInstitution?: string;
    personCourseStartDate?: Date;
    personCourseFinishDate?: Date;
    personCourseDescription?: string;
    personCourseCertificateFile?: string;
}
export declare class BankDataDto {
    bankName?: string;
    bankBranch?: string;
    bankAccount?: string;
    bankAccountType?: BankAccountType;
}
export declare class RelatedFileDto {
    filesDescription: string;
    relatedFilesFiles: string;
    relatedFilesDateDay: number;
    relatedFilesDateMonth: number;
    relatedFilesDateYear: number;
}
export declare class CreatePersonProfileDto {
    userId: string;
    personName: string;
    personNickname?: string;
    gender: Gender;
    birthday: Date;
    maritalStatus?: MaritalStatus;
    motherName?: string;
    fatherName?: string;
    tagId: string[];
    personDescription?: string;
    cpf?: string;
    cpfFile?: string;
    rg?: string;
    rgIssuingAuthority?: string;
    rgIssuanceDate?: Date;
    rgState?: string;
    rgFile?: string;
    passport?: string;
    passportIssuanceDate?: Date;
    passportExpirationDate?: Date;
    passportFile?: string;
    phoneNumberOne?: string;
    phoneNumberTwo?: string;
    emailOne?: string;
    emailTwo?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    x?: string;
    addressOneCepBrasilApi?: string;
    addressOneType?: string;
    addressOneStreet?: string;
    addressOneNumber?: string;
    addressOneComplement?: string;
    addressOneCity?: string;
    addressOneState?: string;
    addressTwoCepBrasilApi?: string;
    addressTwoType?: string;
    addressTwoStreet?: string;
    addressTwoNumber?: string;
    addressTwoComplement?: string;
    addressTwoCity?: string;
    addressTwoState?: string;
    professions?: PersonJobDto[];
    personEducation?: EducationLevel;
    personEducations?: PersonEducationDto[];
    personCourses?: PersonCourseDto[];
    personLanguages?: string[];
    bankDataOne?: BankDataDto;
    bankDataTwo?: BankDataDto;
    relatedFiles?: RelatedFileDto[];
}
declare const UpdatePersonProfileDto_base: import("@nestjs/common").Type<Partial<CreatePersonProfileDto>>;
export declare class UpdatePersonProfileDto extends UpdatePersonProfileDto_base {
}
export declare class PersonProfileFilterDto {
    page?: number;
    limit?: number;
}
export {};
