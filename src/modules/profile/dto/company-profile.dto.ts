import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// Enums
export enum ContactType {
  MOBILE = 'mobile',
  EMAIL = 'email',
  WEBSITE = 'website',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
}

export enum AddressType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
}

export enum AccountType {
  CURRENT = 'currentAccount',
  SAVINGS = 'savingsAccount',
}

// Nested DTOs
export class PartnerDto {
  @ApiProperty({
    example: 'personId',
    description: 'Reference to person',
  })
  @IsNotEmpty()
  @IsString()
  personId: string;
}

export class ContactDto {
  @ApiProperty({ enum: ContactType, example: ContactType.MOBILE })
  @IsNotEmpty()
  @IsEnum(ContactType)
  contactType: ContactType;

  @ApiProperty({ example: '+55 11 91234-5678' })
  @IsNotEmpty()
  @IsString()
  contactValue: string;

  @ApiProperty({ example: 'WhatsApp' })
  @IsNotEmpty()
  @IsString()
  contactComplement: string;
}

export class RelatedFileDto {
  @ApiProperty({ example: 'Descrição do arquivo' })
  @IsNotEmpty()
  @IsString()
  filesDescription: string;

  @ApiProperty({ example: 'arquivo.pdf' })
  @IsNotEmpty()
  @IsString()
  relatedFilesFiles: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  @IsNumber()
  relatedFilesDateDay: number;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsNumber()
  relatedFilesDateMonth: number;

  @ApiProperty({ example: 2023 })
  @IsNotEmpty()
  @IsNumber()
  relatedFilesDateYear: number;
}

export class BankDataDto {
  @ApiPropertyOptional({ example: '341' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '1234' })
  @IsOptional()
  @IsString()
  bankBranch?: string;

  @ApiPropertyOptional({ example: '56789-0' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({ enum: AccountType, example: AccountType.CURRENT })
  @IsOptional()
  @IsEnum(AccountType)
  bankAccountType?: AccountType;
}

export class CreateCompanyProfileDto {
  @ApiProperty({ example: 'userId', readOnly: true })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: 'Empresa ABC LTDA' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'ABC Negócios' })
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiPropertyOptional({
    example: '2001-01-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday?: Date;

  @ApiPropertyOptional({ example: 'Sociedade Limitada' })
  @IsOptional()
  @IsString()
  legalNature?: string;

  @ApiPropertyOptional({ example: 'Empresa especializada em...' })
  @IsOptional()
  @IsString()
  companyDescription?: string;

  @ApiPropertyOptional({ example: 'logo.png' })
  @IsOptional()
  @IsString()
  logoImage?: string;

  @ApiPropertyOptional({ example: ['foto1.png', 'foto2.png'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companyImages?: string[];

  @ApiProperty({
    description: 'Related tag IDs',
    example: ['tagId1', 'tagId2'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tagId: string[];

  // Sócios
  @ApiPropertyOptional({ type: [PartnerDto] })
  @IsOptional()
  @IsArray()
  @Type(() => PartnerDto)
  partners?: PartnerDto[];

  // Contatos
  @ApiPropertyOptional({ type: [ContactDto] })
  @IsOptional()
  @IsArray()
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  // Endereço 1
  @ApiPropertyOptional({ example: '01001-000' })
  @IsOptional()
  @IsString()
  addressOneCepBrasilApi?: string;

  @ApiPropertyOptional({ enum: AddressType, example: AddressType.COMMERCIAL })
  @IsOptional()
  @IsString()
  addressOneType?: string;

  @ApiPropertyOptional({ example: 'Av. Paulista' })
  @IsOptional()
  @IsString()
  addressOneStreet?: string;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsString()
  addressOneNumber?: string;

  @ApiPropertyOptional({ example: 'Fundos' })
  @IsOptional()
  @IsString()
  addressOneComplement?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString()
  addressOneCity?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  addressOneState?: string;

  // Endereço 2
  @ApiPropertyOptional({ example: '02002-000' })
  @IsOptional()
  @IsString()
  addressTwoCepBrasilApi?: string;

  @ApiPropertyOptional({ enum: AddressType, example: AddressType.RESIDENTIAL })
  @IsOptional()
  @IsString()
  addressTwoType?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores' })
  @IsOptional()
  @IsString()
  addressTwoStreet?: string;

  @ApiPropertyOptional({ example: '222' })
  @IsOptional()
  @IsString()
  addressTwoNumber?: string;

  @ApiPropertyOptional({ example: 'Casa' })
  @IsOptional()
  @IsString()
  addressTwoComplement?: string;

  @ApiPropertyOptional({ example: 'Campinas' })
  @IsOptional()
  @IsString()
  addressTwoCity?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  addressTwoState?: string;

  // Bancos
  @ApiPropertyOptional({ type: BankDataDto })
  @IsOptional()
  @Type(() => BankDataDto)
  bankDataOne?: BankDataDto;

  @ApiPropertyOptional({ type: BankDataDto })
  @IsOptional()
  @Type(() => BankDataDto)
  bankDataTwo?: BankDataDto;

  // Arquivos
  @ApiPropertyOptional({ type: [RelatedFileDto] })
  @IsOptional()
  @IsArray()
  @Type(() => RelatedFileDto)
  relatedFiles?: RelatedFileDto[];

  @ApiProperty({ example: 'userId', readOnly: true })
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiProperty({ example: 'userId', readOnly: true })
  @IsNotEmpty()
  @IsString()
  ownerId: string;
}

export class UpdateCompanyProfileDto extends PartialType(
  CreateCompanyProfileDto,
) {}

export class CompanyProfileFilterDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
