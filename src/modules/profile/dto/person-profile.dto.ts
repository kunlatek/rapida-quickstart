import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  NEUTRAL = 'N',
  OTHER = 'O',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  ENGAGED = 'engaged',
  COMMON_LAW = 'commonLawMarried',
  NULL = '',
}

export enum EducationLevel {
  INCOMPLETE_ELEMENTARY = 'incompleteElementarySchool',
  COMPLETE_ELEMENTARY = 'completeElementarySchool',
  INCOMPLETE_HIGH = 'incompleteHighSchool',
  COMPLETE_HIGH = 'completeHighSchool',
  INCOMPLETE_HIGHER = 'incompleteHigherEducation',
  COMPLETE_HIGHER = 'completeHigherEducation',
  POSTGRADUATE = 'postgraduate',
  MASTERS = 'mastersDegree',
  DOCTORATE = 'doctorate',
  NULL = '',
}

export enum BankAccountType {
  CURRENT = 'currentAccount',
  SAVINGS = 'savingsAccount',
}

export class PersonJobDto {
  @ApiPropertyOptional({
    example: '60f6f9d3c25e4c0023bdf123',
    description: 'Job ID (referência à entidade Job)',
  })
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Month when the person started this job',
  })
  @IsOptional()
  @IsNumber()
  jobStartDateMonth?: number;

  @ApiPropertyOptional({
    example: 2020,
    description: 'Year when the person started this job',
  })
  @IsOptional()
  @IsNumber()
  jobStartDateYear?: number;

  @ApiPropertyOptional({
    example: 6,
    description: 'Month when the person finished this job',
  })
  @IsOptional()
  @IsNumber()
  jobFinishDateMonth?: number;

  @ApiPropertyOptional({
    example: 2022,
    description: 'Year when the person finished this job',
  })
  @IsOptional()
  @IsNumber()
  jobFinishDateYear?: number;

  @ApiPropertyOptional({
    example: 'Responsável por atendimento ao cliente.',
    description: 'Description of job responsibilities',
  })
  @IsOptional()
  @IsString()
  jobDescription?: string;
}

export class PersonEducationDto {
  @ApiPropertyOptional({
    example: 'Engenharia Civil',
    description: 'Course name',
  })
  @IsOptional()
  @IsString()
  personEducationCourse?: string;

  @ApiPropertyOptional({
    example: 'UFAL',
    description: 'Educational institution',
  })
  @IsOptional()
  @IsString()
  personEducationInstitution?: string;

  @ApiPropertyOptional({
    example: '2015-01-01',
    description: 'Start date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  personEducationStartDate?: Date;

  @ApiPropertyOptional({
    example: '2019-12-20',
    description: 'Finish date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  personEducationFinishDate?: Date;

  @ApiPropertyOptional({
    example: 'Curso de graduação completo.',
    description: 'Course description',
  })
  @IsOptional()
  @IsString()
  personEducationDescription?: string;

  @ApiPropertyOptional({
    example: 'certificado.pdf',
    description: 'Certificate file',
  })
  @IsOptional()
  @IsString()
  personEducationCertificateFile?: string;
}

export class PersonCourseDto {
  @ApiPropertyOptional({
    example: 'Excel Avançado',
    description: 'Course name',
  })
  @IsOptional()
  @IsString()
  personCourseName?: string;

  @ApiPropertyOptional({ example: 'Senac', description: 'Institution name' })
  @IsOptional()
  @IsString()
  personCourseInstitution?: string;

  @ApiPropertyOptional({
    example: '2022-01-10',
    description: 'Start date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  personCourseStartDate?: Date;

  @ApiPropertyOptional({
    example: '2022-03-15',
    description: 'Finish date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  personCourseFinishDate?: Date;

  @ApiPropertyOptional({
    example: 'Curso intensivo de Excel com certificação.',
    description: 'Course description',
  })
  @IsOptional()
  @IsString()
  personCourseDescription?: string;

  @ApiPropertyOptional({
    example: 'excel_cert.pdf',
    description: 'Certificate file',
  })
  @IsOptional()
  @IsString()
  personCourseCertificateFile?: string;
}

export class BankDataDto {
  @ApiPropertyOptional({ example: '341', description: 'Bank code or name' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '1234-5', description: 'Branch number' })
  @IsOptional()
  @IsString()
  bankBranch?: string;

  @ApiPropertyOptional({
    example: '123456-7',
    description: 'Bank account number',
  })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({
    example: BankAccountType.CURRENT,
    enum: BankAccountType,
    description: 'Account type',
  })
  @IsOptional()
  @IsEnum(BankAccountType)
  bankAccountType?: BankAccountType;
}

export class RelatedFileDto {
  @ApiProperty({
    example: 'Comprovante de residência',
    description: 'Description of the file',
  })
  @IsNotEmpty()
  @IsString()
  filesDescription: string;

  @ApiProperty({
    example: 'comprovante.pdf',
    description: 'Filename or path to uploaded file',
  })
  @IsNotEmpty()
  @IsString()
  relatedFilesFiles: string;

  @ApiProperty({
    example: 15,
    description: 'Day of file date (1-31)',
  })
  @IsNotEmpty()
  @IsNumber()
  relatedFilesDateDay: number;

  @ApiProperty({
    example: 8,
    description: 'Month of file date (1-12)',
  })
  @IsNotEmpty()
  @IsNumber()
  relatedFilesDateMonth: number;

  @ApiProperty({
    example: 2023,
    description: 'Year of file date (four digits)',
  })
  @IsNotEmpty()
  @IsNumber()
  relatedFilesDateYear: number;
}

export class CreatePersonProfileDto {
  @ApiProperty({
    example: '67d1b1b65e1fc7bab385b08c',
    description: 'User ID (extracted from JWT)',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Joana Pessoa', description: 'Full name' })
  @IsNotEmpty()
  @IsString()
  personName: string;

  @ApiPropertyOptional({ example: 'Joana P.', description: 'Nickname' })
  @IsOptional()
  @IsString()
  personNickname?: string;

  @ApiProperty({
    example: 'F',
    description: 'Gender (M, F, N, O)',
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: '1990-05-20',
    description: 'Birthdate',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @ApiPropertyOptional({
    example: 'Solteiro',
    description: 'Marital status',
    enum: MaritalStatus,
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({
    example: 'Maria da Silva',
    description: "Mother's name",
  })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiPropertyOptional({
    example: 'João da Silva',
    description: "Father's name",
  })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiProperty({
    description: 'Related tag IDs',
    example: ['tagId1', 'tagId2'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tagId: string[];

  @ApiPropertyOptional({
    example: 'Descrição longa sobre a pessoa',
    description: 'Personal description',
  })
  @IsOptional()
  @IsString()
  personDescription?: string;

  // 🔹 Documentos
  @ApiPropertyOptional({ example: '123.456.789-00', description: 'CPF number' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    example: 'cpf_file.pdf',
    description: 'CPF document file',
  })
  @IsOptional()
  @IsString()
  cpfFile?: string;

  @ApiPropertyOptional({ example: 'MG-12.345.678', description: 'RG number' })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiPropertyOptional({
    example: 'SSP-MG',
    description: 'Issuing authority for RG',
  })
  @IsOptional()
  @IsString()
  rgIssuingAuthority?: string;

  @ApiPropertyOptional({
    example: '2010-06-15',
    description: 'RG issuance date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  rgIssuanceDate?: Date;

  @ApiPropertyOptional({
    example: 'MG',
    description: 'State that issued the RG',
  })
  @IsOptional()
  @IsString()
  rgState?: string;

  @ApiPropertyOptional({
    example: 'rg_file.pdf',
    description: 'RG document file',
  })
  @IsOptional()
  @IsString()
  rgFile?: string;

  @ApiPropertyOptional({ example: 'AA1234567', description: 'Passport number' })
  @IsOptional()
  @IsString()
  passport?: string;

  @ApiPropertyOptional({
    example: '2015-01-01',
    description: 'Passport issuance date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  passportIssuanceDate?: Date;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Passport expiration date',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  passportExpirationDate?: Date;

  @ApiPropertyOptional({
    example: 'passport_file.pdf',
    description: 'Passport file',
  })
  @IsOptional()
  @IsString()
  passportFile?: string;

  // 🔹 Contatos
  @ApiPropertyOptional({
    example: '+55 11 91234-5678',
    description: 'Primary phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumberOne?: string;

  @ApiPropertyOptional({
    example: '+55 11 99876-5432',
    description: 'Secondary phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumberTwo?: string;

  @ApiPropertyOptional({
    example: 'email@primario.com',
    description: 'Primary email address',
  })
  @IsOptional()
  @IsString()
  emailOne?: string;

  @ApiPropertyOptional({
    example: 'email@secundario.com',
    description: 'Secondary email address',
  })
  @IsOptional()
  @IsString()
  emailTwo?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/exemplo',
    description: 'LinkedIn profile',
  })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({
    example: '@instauser',
    description: 'Instagram handle',
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({
    example: 'facebook.com/user',
    description: 'Facebook profile',
  })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({
    example: '@xhandle',
    description: 'X (Twitter) handle',
  })
  @IsOptional()
  @IsString()
  x?: string;

  // 🔹 Endereços
  @ApiPropertyOptional({
    example: '01001-000',
    description: 'Primary address ZIP Code (CEP)',
  })
  @IsOptional()
  @IsString()
  addressOneCepBrasilApi?: string;

  @ApiPropertyOptional({
    example: 'residential',
    description: 'Primary address type (residential, commercial)',
  })
  @IsOptional()
  @IsString()
  addressOneType?: string;

  @ApiPropertyOptional({
    example: 'Avenida Brasil',
    description: 'Primary address street',
  })
  @IsOptional()
  @IsString()
  addressOneStreet?: string;

  @ApiPropertyOptional({
    example: '410-A',
    description: 'Primary address number',
  })
  @IsOptional()
  @IsString()
  addressOneNumber?: string;

  @ApiPropertyOptional({
    example: 'Ao lado da Igreja São Francisco',
    description: 'Primary address complement',
  })
  @IsOptional()
  @IsString()
  addressOneComplement?: string;

  @ApiPropertyOptional({
    example: 'Maceió',
    description: 'Primary address city',
  })
  @IsOptional()
  @IsString()
  addressOneCity?: string;

  @ApiPropertyOptional({
    example: 'AL',
    description: 'Primary address state',
  })
  @IsOptional()
  @IsString()
  addressOneState?: string;

  @ApiPropertyOptional({
    example: '01101-000',
    description: 'Secondary address ZIP Code (CEP)',
  })
  @IsOptional()
  @IsString()
  addressTwoCepBrasilApi?: string;

  @ApiPropertyOptional({
    example: 'commercial',
    description: 'Secondary address type (residential, commercial)',
  })
  @IsOptional()
  @IsString()
  addressTwoType?: string;

  @ApiPropertyOptional({
    example: 'Rua das Flores',
    description: 'Secondary address street',
  })
  @IsOptional()
  @IsString()
  addressTwoStreet?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'Secondary address number',
  })
  @IsOptional()
  @IsString()
  addressTwoNumber?: string;

  @ApiPropertyOptional({
    example: 'Fundos',
    description: 'Secondary address complement',
  })
  @IsOptional()
  @IsString()
  addressTwoComplement?: string;

  @ApiPropertyOptional({
    example: 'Recife',
    description: 'Secondary address city',
  })
  @IsOptional()
  @IsString()
  addressTwoCity?: string;

  @ApiPropertyOptional({
    example: 'PE',
    description: 'Secondary address state',
  })
  @IsOptional()
  @IsString()
  addressTwoState?: string;

  @ApiPropertyOptional({
    type: [PersonJobDto],
    description: 'List of professional experiences',
  })
  @IsOptional()
  @IsArray()
  @Type(() => PersonJobDto)
  professions?: PersonJobDto[];

  @ApiPropertyOptional({
    example: EducationLevel.COMPLETE_HIGHER,
    enum: EducationLevel,
    description: 'General education level',
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  personEducation?: EducationLevel;

  @ApiPropertyOptional({
    type: [PersonEducationDto],
    description: 'List of academic formations',
  })
  @IsOptional()
  @IsArray()
  @Type(() => PersonEducationDto)
  personEducations?: PersonEducationDto[];

  @ApiPropertyOptional({
    type: [PersonCourseDto],
    description: 'List of complementary courses',
  })
  @IsOptional()
  @IsArray()
  @Type(() => PersonCourseDto)
  personCourses?: PersonCourseDto[];

  @ApiPropertyOptional({
    example: ['Português', 'Inglês'],
    isArray: true,
    description: 'Languages spoken by the person',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personLanguages?: string[];

  @ApiPropertyOptional({
    type: BankDataDto,
    description: 'First bank account information',
  })
  @IsOptional()
  @Type(() => BankDataDto)
  bankDataOne?: BankDataDto;

  @ApiPropertyOptional({
    type: BankDataDto,
    description: 'Second bank account information',
  })
  @IsOptional()
  @Type(() => BankDataDto)
  bankDataTwo?: BankDataDto;

  @ApiPropertyOptional({
    type: [RelatedFileDto],
    description: 'List of related files with metadata',
  })
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

export class UpdatePersonProfileDto extends PartialType(CreatePersonProfileDto) {}

export class PersonProfileFilterDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
