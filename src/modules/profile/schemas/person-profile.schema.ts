import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Gender,
  MaritalStatus,
  EducationLevel,
  PersonJobDto,
  PersonEducationDto,
  PersonCourseDto,
  BankDataDto,
  RelatedFileDto,
} from '../dto/person-profile.dto';

@Schema({ timestamps: true })
export class PersonProfile extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  personName: string;

  @Prop()
  personNickname?: string;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ enum: MaritalStatus })
  maritalStatus?: MaritalStatus;

  @Prop()
  motherName?: string;

  @Prop()
  fatherName?: string;

  @Prop({ type: [String] })
  tagId: string[];

  @Prop()
  personDescription?: string;

  // 🔹 Documentos
  @Prop()
  cpf?: string;

  @Prop()
  cpfFile?: string;

  @Prop()
  rg?: string;

  @Prop()
  rgIssuingAuthority?: string;

  @Prop({ type: Date })
  rgIssuanceDate?: Date;

  @Prop()
  rgState?: string;

  @Prop()
  rgFile?: string;

  @Prop()
  passport?: string;

  @Prop({ type: Date })
  passportIssuanceDate?: Date;

  @Prop({ type: Date })
  passportExpirationDate?: Date;

  @Prop()
  passportFile?: string;

  // 🔹 Contatos
  @Prop()
  phoneNumberOne?: string;

  @Prop()
  phoneNumberTwo?: string;

  @Prop()
  emailOne?: string;

  @Prop()
  emailTwo?: string;

  @Prop()
  linkedin?: string;

  @Prop()
  instagram?: string;

  @Prop()
  facebook?: string;

  @Prop()
  x?: string;

  // 🔹 Endereços
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

  // 🔹 Profissões
  @Prop({ type: [Object] })
  professions?: PersonJobDto[];

  // 🔹 Educação
  @Prop({ enum: EducationLevel })
  personEducation?: EducationLevel;

  @Prop({ type: [Object] })
  personEducations?: PersonEducationDto[];

  @Prop({ type: [Object] })
  personCourses?: PersonCourseDto[];

  @Prop({ type: [String] })
  personLanguages?: string[];

  // 🔹 Banco
  @Prop({ type: Object })
  bankDataOne?: BankDataDto;

  @Prop({ type: Object })
  bankDataTwo?: BankDataDto;

  // 🔹 Arquivos relacionados
  @Prop({ type: [Object] })
  relatedFiles?: RelatedFileDto[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  ownerId: string;
}

export const PersonProfileSchema = SchemaFactory.createForClass(PersonProfile);
