import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from 'src/permeson/profile/profile.dto';

export class FormSignupDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  invitationToken: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  pictureProfile: string;
}

export class HttpAuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  userId: string;
}
