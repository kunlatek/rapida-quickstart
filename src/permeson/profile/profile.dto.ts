import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class FormProfileDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  pictureProfile?: string;

  @ApiHideProperty()
  user: string;
}

export class ProfileDto extends FormProfileDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
