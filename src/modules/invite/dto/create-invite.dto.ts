import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInviteDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário convidado',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Role do usuário convidado',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'ID do usuário que está criando o convite',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  createdBy: string;
} 