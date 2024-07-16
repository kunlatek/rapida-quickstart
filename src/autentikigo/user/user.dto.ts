import { ApiProperty } from '@nestjs/swagger';

export class FormUserDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;
}

export class UserDto extends FormUserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
