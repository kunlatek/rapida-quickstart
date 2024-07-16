import { ApiProperty } from '@nestjs/swagger';

export class FormInvitationDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  permissionId: string;

  @ApiProperty({ required: false, nullable: true, default: false })
  accepted: boolean;
}

export class InvitationDto extends FormInvitationDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
