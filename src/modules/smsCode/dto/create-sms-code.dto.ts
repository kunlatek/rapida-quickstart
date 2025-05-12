import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateSmsCodeDto {
    @ApiProperty({
        description: 'The phone number of the user',
        example: '+5511999999999',
    })
    @IsPhoneNumber('BR')
    phone: string;
}
