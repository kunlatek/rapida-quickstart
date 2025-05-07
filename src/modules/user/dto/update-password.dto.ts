import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'currentP@ssw0rd!',
    description: 'Current password',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'newP@ssw0rd!',
    description: 'New password with a minimum length of 8 characters',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
} 