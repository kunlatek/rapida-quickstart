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
} 