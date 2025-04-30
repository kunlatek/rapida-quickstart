import { Document, Types } from 'mongoose';
export type CompanyProfileDocument = CompanyProfile & Document;
export declare class CompanyProfile {
    userId: Types.ObjectId;
    cnpj?: string;
    companyName: string;
    businessName: string;
    birthday?: Date;
    legalNature?: string;
    companyDescription?: string;
    logoImage?: string;
    companyImages?: string[];
    tagId: string[];
    partners?: {
        personId: Types.ObjectId;
    }[];
    contacts?: {
        contactType: string;
        contactValue: string;
        contactComplement: string;
    }[];
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
    bankDataOne?: {
        bankName?: string;
        bankBranch?: string;
        bankAccount?: string;
        bankAccountType?: string;
    };
    bankDataTwo?: {
        bankName?: string;
        bankBranch?: string;
        bankAccount?: string;
        bankAccountType?: string;
    };
    relatedFiles?: {
        filesDescription: string;
        relatedFilesFiles: string;
        relatedFilesDateDay: number;
        relatedFilesDateMonth: number;
        relatedFilesDateYear: number;
    }[];
}
export declare const CompanyProfileSchema: import("mongoose").Schema<CompanyProfile, import("mongoose").Model<CompanyProfile, any, any, any, Document<unknown, any, CompanyProfile> & CompanyProfile & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyProfile, Document<unknown, {}, import("mongoose").FlatRecord<CompanyProfile>> & import("mongoose").FlatRecord<CompanyProfile> & {
    _id: Types.ObjectId;
}>;
