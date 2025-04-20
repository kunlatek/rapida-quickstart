import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'ID Token provided by Google after successful authentication',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3NDg... (truncated for display)',
  })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
