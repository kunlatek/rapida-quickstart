import { ApiProperty } from '@nestjs/swagger';

export class HttpAuthResponseDto {
  @ApiProperty()
  token: string;
}
