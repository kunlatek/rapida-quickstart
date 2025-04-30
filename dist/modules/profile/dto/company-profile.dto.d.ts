export declare enum ContactType {
    MOBILE = "mobile",
    EMAIL = "email",
    WEBSITE = "website",
    LINKEDIN = "linkedin",
    INSTAGRAM = "instagram",
    FACEBOOK = "facebook"
}
export declare enum AddressType {
    RESIDENTIAL = "residential",
    COMMERCIAL = "commercial"
}
export declare enum AccountType {
    CURRENT = "currentAccount",
    SAVINGS = "savingsAccount"
}
export declare class PartnerDto {
    personId: string;
}
export declare class ContactDto {
    contactType: ContactType;
    contactValue: string;
    contactComplement: string;
}
export declare class RelatedFileDto {
    filesDescription: string;
    relatedFilesFiles: string;
    relatedFilesDateDay: number;
    relatedFilesDateMonth: number;
    relatedFilesDateYear: number;
}
export declare class BankDataDto {
    bankName?: string;
    bankBranch?: string;
    bankAccount?: string;
    bankAccountType?: AccountType;
}
export declare class CreateCompanyProfileDto {
    userId: string;
    cnpj?: string;
    companyName: string;
    businessName: string;
    birthday?: Date;
    legalNature?: string;
    companyDescription?: string;
    logoImage?: string;
    companyImages?: string[];
    tagId: string[];
    partners?: PartnerDto[];
    contacts?: ContactDto[];
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
    bankDataOne?: BankDataDto;
    bankDataTwo?: BankDataDto;
    relatedFiles?: RelatedFileDto[];
}
declare const UpdateCompanyProfileDto_base: import("@nestjs/common").Type<Partial<CreateCompanyProfileDto>>;
export declare class UpdateCompanyProfileDto extends UpdateCompanyProfileDto_base {
}
export declare class CompanyProfileFilterDto {
    page?: number;
    limit?: number;
}
export {};
