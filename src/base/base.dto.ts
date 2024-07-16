import { Type } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export function HttpArrayResponseDto<T>(classRef: Type<T>): any {
  class HttpArrayResponseClass {
    @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(classRef) } })
    result: T[];

    @ApiProperty()
    page: number;

    @ApiProperty()
    total: number;
  }

  return HttpArrayResponseClass;
}
