import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
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
