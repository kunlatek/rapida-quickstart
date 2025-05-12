import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class VerifySmsCodeDto {
    @ApiProperty({
        description: 'The phone number of the user',
        example: '+5511999999999',
    })
    @IsPhoneNumber('BR')
    phone: string;

    @ApiProperty({
        description: 'The code of the user',
        example: '123456',
    })
    code: string;
}