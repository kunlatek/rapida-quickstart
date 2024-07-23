import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormUserDto } from '../user/user.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  FormSignupDto,
  HttpAuthResponseDto,
} from './auth.dto';

@ApiTags('Autentikigo/Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: FormSignupDto })
  @ApiResponse({
    status: 200,
    description: 'User registered',
    type: HttpAuthResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('register')
  async register(@Body() user: FormSignupDto) {
    await this.authService.registerWithInvitation(user);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: FormUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: HttpAuthResponseDto,
  })
  @Post('login')
  async login(
    @Body() user: FormUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Send recovery password email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Recovery password email sent',
  })
  @Post('recovery-password-email/send')
  sendForgotPasswordEmail(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendForgotPasswordEmail(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 204,
    description: 'Password changed successfully',
  })
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
