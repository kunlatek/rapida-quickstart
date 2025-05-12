import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail()
  email: string;
}