import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompanyProfileDocument = CompanyProfile & Document;

@Schema({ timestamps: true })
export class CompanyProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  cnpj?: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  birthday?: Date;

  @Prop()
  legalNature?: string;

  @Prop()
  companyDescription?: string;

  @Prop()
  logoImage?: string;

  @Prop([String])
  companyImages?: string[];

  @Prop({ type: [String] })
  tagId: string[];

  @Prop([
    {
      personId: { type: Types.ObjectId, ref: 'Person', required: true },
    },
  ])
  partners?: { personId: Types.ObjectId }[];

  @Prop([
    {
      contactType: { type: String },
      contactValue: { type: String },
      contactComplement: { type: String },
    },
  ])
  contacts?: {
    contactType: string;
    contactValue: string;
    contactComplement: string;
  }[];

  // Endereço 1
  @Prop()
  addressOneCepBrasilApi?: string;

  @Prop()
  addressOneType?: string;

  @Prop()
  addressOneStreet?: string;

  @Prop()
  addressOneNumber?: string;

  @Prop()
  addressOneComplement?: string;

  @Prop()
  addressOneCity?: string;

  @Prop()
  addressOneState?: string;

  // Endereço 2
  @Prop()
  addressTwoCepBrasilApi?: string;

  @Prop()
  addressTwoType?: string;

  @Prop()
  addressTwoStreet?: string;

  @Prop()
  addressTwoNumber?: string;

  @Prop()
  addressTwoComplement?: string;

  @Prop()
  addressTwoCity?: string;

  @Prop()
  addressTwoState?: string;

  // Banco 1
  @Prop({
    type: {
      bankName: String,
      bankBranch: String,
      bankAccount: String,
      bankAccountType: String,
    },
  })
  bankDataOne?: {
    bankName?: string;
    bankBranch?: string;
    bankAccount?: string;
    bankAccountType?: string;
  };

  // Banco 2
  @Prop({
    type: {
      bankName: String,
      bankBranch: String,
      bankAccount: String,
      bankAccountType: String,
    },
  })
  bankDataTwo?: {
    bankName?: string;
    bankBranch?: string;
    bankAccount?: string;
    bankAccountType?: string;
  };

  @Prop([
    {
      filesDescription: { type: String, required: true },
      relatedFilesFiles: { type: String, required: true },
      relatedFilesDateDay: { type: Number, required: true },
      relatedFilesDateMonth: { type: Number, required: true },
      relatedFilesDateYear: { type: Number, required: true },
    },
  ])
  relatedFiles?: {
    filesDescription: string;
    relatedFilesFiles: string;
    relatedFilesDateDay: number;
    relatedFilesDateMonth: number;
    relatedFilesDateYear: number;
  }[];
}

export const CompanyProfileSchema =
  SchemaFactory.createForClass(CompanyProfile);
