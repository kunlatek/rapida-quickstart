import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User e-mail, must be unique',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'p4s$W0rd!',
    description: 'Password with a minimum length of 8 characters',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class CreateUserByInvitationDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User e-mail, must be unique',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Invitation token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'p4s$W0rd!',
    description: 'Password with a minimum length of 8 characters',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}