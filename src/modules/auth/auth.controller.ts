import { Controller, Post, Req, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiSecurity,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { AppleLoginDto } from "./dto/apple-login.dto";
import { UserRole } from "src/enums/user-role.enum";
import { SignupDto } from "./dto/signup.dto";
import { RegisterInitDto } from "./dto/register-init.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("google/login")
  @ApiOperation({ summary: "Login via Google using ID Token" })
  @ApiBody({ type: GoogleLoginDto })
  @ApiResponse({
    status: 200,
    description: "Returns JWT access token after validating Google ID Token",
  })
  async googleLoginWithToken(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto.idToken);
  }

  @Post("apple/login")
  @ApiOperation({ summary: "Login via Apple using ID Token" })
  @ApiBody({ type: AppleLoginDto })
  @ApiResponse({
    status: 200,
    description: "Returns JWT access token after validating Apple ID Token",
  })
  async appleLoginWithToken(@Body() dto: AppleLoginDto) {
    return this.authService.appleLogin(dto.idToken);
  }

  @Post("login")
  @UseGuards(AuthGuard("email"))
  @ApiOperation({
    summary: "Local login with email/password",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description:
      "Returns JWT access token on successful login with available roles",
  })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post("switch-role")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiSecurity("jwt")
  @ApiOperation({ summary: "Switch active role and receive new JWT token" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        role: {
          type: "string",
          enum: Object.values(UserRole),
          example: "admin",
        },
      },
      required: ["role"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Returns a new JWT access token with the selected role active",
  })
  async switchRole(@Req() req, @Body("role") role: UserRole) {
    return this.authService.switchActiveRole(req.user, role);
  }

  @Post("register-init")
  @ApiOperation({ summary: "Inicia o processo de registro enviando email" })
  @ApiBody({ type: RegisterInitDto })
  @ApiResponse({
    status: 200,
    description: "Email de registro enviado com sucesso",
  })
  @ApiResponse({ status: 400, description: "Email já cadastrado" })
  async registerInit(@Body() registerInitDto: RegisterInitDto) {
    return this.authService.registerInit(registerInitDto);
  }

  @Post("signup")
  @ApiOperation({ summary: "Completa o registro de um novo usuário com token" })
  @ApiResponse({
    status: 201,
    description: "Usuário registrado com sucesso",
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou email já existe",
  })
  @ApiResponse({
    status: 401,
    description: "Token de registro inválido ou expirado",
  })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Envia um email de recuperação de senha" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: "Email de recuperação de senha enviado com sucesso",
  })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reseta a senha do usuário" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: "Senha resetada com sucesso" })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou token inválido",
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
