import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormUserDto } from '../user/user.dto';
import { HttpAuthResponseDto } from './auth.dto';

@ApiTags('Autentikigo/Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: FormUserDto })
  @ApiResponse({
    status: 204,
    description: 'User registered',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('register')
  async register(@Body() user: FormUserDto) {
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
    return { token: await this.authService.login(user) };
  }
}
