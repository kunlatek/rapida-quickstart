import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    description: 'O token recebido por email para resetar a senha',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYxODk2NjZ9.sR0bAUn2k4Z3yRiley9j8_H2b...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'A nova senha para o usuário (mínimo 8 caracteres)',
    example: 'newStr0ngP@ss!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
