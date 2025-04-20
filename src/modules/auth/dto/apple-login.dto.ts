import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppleLoginDto {
  @ApiProperty({
    description: 'ID Token provided by Apple after successful authentication',
    example: 'eyJraWQiOiJ... (Apple JWT truncated)',
  })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
