import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateSmsCodeDto } from './dto/create-sms-code.dto';
import { VerifySmsCodeDto } from './dto/verify-sms-code.dto';
import { SmsCodeService } from './sms-code.service';

/**
 * Controller responsible for handling SMS code routes.
 */
@ApiTags('sms-code')
@Controller('sms-code')
export class SmsCodeController {
  constructor(private readonly smsCodeService: SmsCodeService) {}

  @Post('send-sms')
  @ApiOperation({ summary: 'Envia um código SMS para o usuário' })
  @ApiBody({ type: CreateSmsCodeDto })
  @ApiResponse({ status: 200, description: 'Código SMS enviado com sucesso' })
  async sendSms(@Body() createSmsCodeDto: CreateSmsCodeDto) {
    return this.smsCodeService.sendSms(createSmsCodeDto);
  }

  @Post('verify-sms')
  @ApiOperation({ summary: 'Verifica um código SMS' })
  @ApiBody({ type: VerifySmsCodeDto })
  @ApiResponse({ status: 200, description: 'Código SMS verificado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código SMS inválido ou expirado' })
  async verifySms(@Body() verifySmsCodeDto: VerifySmsCodeDto) {
    return this.smsCodeService.verifySmsCode(verifySmsCodeDto);
  }
}
