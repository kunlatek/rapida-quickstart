import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email, must be valid.',
  })
  email: string;

  @ApiProperty({
    example: 'p4s$W0rd!',
    description: 'User password, min length = 8 characters.',
  })
  password: string;
}
