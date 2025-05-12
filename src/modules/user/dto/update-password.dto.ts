import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: '1234567890',
    description: 'Phone number',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'newP@ssw0rd!',
    description: 'New password with a minimum length of 8 characters',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    example: '123456',
    description: 'SMS code',
  })
  @IsNotEmpty()
  @IsString()
  smsCode: string;
} 