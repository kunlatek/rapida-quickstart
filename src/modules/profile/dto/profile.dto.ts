import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProfileType {
  PERSON = 'person',
  COMPANY = 'company',
}

// DTO Base
export class CreateProfileDto {
  @IsEnum(ProfileType)
  type: ProfileType;

  @IsNotEmpty()
  userId: string;
}

// Person DTO
export class CreatePersonProfileDto extends CreateProfileDto {
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  birthdate?: Date;

  @IsOptional()
  cpf?: string;
}

// Company DTO
export class CreateCompanyProfileDto extends CreateProfileDto {
  @IsNotEmpty()
  businessName: string;

  @IsNotEmpty()
  cnpj: string;

  @IsOptional()
  industry?: string;
}

// Update DTO (genérico)
export class UpdateProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profileData?: Partial<CreateProfileDto>;
}
