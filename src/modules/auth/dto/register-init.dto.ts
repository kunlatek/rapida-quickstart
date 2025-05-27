import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterInitDto {
  @ApiProperty({
    description: "Email do usuário",
    example: "usuario@exemplo.com",
  })
  @IsEmail()
  email: string;
}
