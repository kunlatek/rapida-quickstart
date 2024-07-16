import { ApiProperty } from '@nestjs/swagger';

export class FormModuleDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: true })
  route: string;

  @ApiProperty({ required: true })
  icon: string;
}

export class ModuleDto extends FormModuleDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
