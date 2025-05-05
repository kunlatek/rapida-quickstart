import { IsOptional, IsString, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "new.email@example.com" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: "newP@ssw0rd!",
    description: "Password with a minimum length of 8 characters",
  })
  @IsOptional()
  @MinLength(8)
  password?: string;
}
