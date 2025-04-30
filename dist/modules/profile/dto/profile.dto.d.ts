export declare enum ProfileType {
    PERSON = "person",
    COMPANY = "company"
}
export declare class CreateProfileDto {
    type: ProfileType;
    userId: string;
}
export declare class CreatePersonProfileDto extends CreateProfileDto {
    fullName: string;
    birthdate?: Date;
    cpf?: string;
}
export declare class CreateCompanyProfileDto extends CreateProfileDto {
    businessName: string;
    cnpj: string;
    industry?: string;
}
export declare class UpdateProfileDto {
    profileData?: Partial<CreateProfileDto>;
}
