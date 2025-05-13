import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserByInvitationDto, CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/enums/user-role.enum";
import { ErrorService } from "src/common/services/error.service";
import { ErrorCode } from "src/common/constants/error-code.enum";
import { AuthGuard } from "@nestjs/passport";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({
    type: CreateUserDto,
    description: "Email and password, password must have min length = 8",
  })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Email already exists",
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return {
      message: "User created successfully",
      userId: user._id,
    };
  }

  @Post("invitation")
  @ApiOperation({ summary: "Create a new user from invitation" })
  @ApiBody({ type: CreateUserByInvitationDto })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Email already exists",
  })
  @ApiResponse({
    status: 404,
    description: "Invitation not found",
  })
  @ApiResponse({
    status: 400,
    description: "Invitation already accepted",
  })
  async createUserByInvitation(@Body() createUserByInvitationDto: CreateUserByInvitationDto) {
    return this.userService.createUserByInvitation(createUserByInvitationDto);
  }

  @Get()
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  async findAll() {
    return this.userService.findAll();
  }

  @Get("me")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN, UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Get my user" })
  async findMe(@Req() req) {
    const userId = req.user?.sub ?? req.user?.userId; // Corrigido: pega ID do JWT
    if (!userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED)
      );
    }
    return this.userService.findMe(userId);
  }

  @Get(":id")
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get a user by ID" })
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch("restore")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Restore own soft-deleted profile" })
  async restoreOwnProfile(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED)
      );
    }
    await this.userService.restoreUser(req.user.userId);
    return { message: "User restored successfully" };
  }

  @Patch("change-password")
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  @ApiResponse({ status: 404, description: "User not found" })
  async changePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED)
      );
    }

    const { oldPassword, newPassword } = updatePasswordDto;

    await this.userService.updatePassword(
      req.user.userId,
      oldPassword,
      newPassword
    );

    return { message: "Password changed successfully" };
  }

  @Patch(":id")
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update a user by ID" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  @ApiSecurity("jwt")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Soft delete a user by ID" })
  async softDeleteUser(@Param("id") id: string) {
    await this.userService.softDeleteUser(id);
    return { message: "User soft deleted successfully" };
  }

  @Delete()
  @ApiSecurity("jwt")
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.PERSON, UserRole.COMPANY)
  @ApiOperation({ summary: "Soft delete own profile" })
  async softDeleteOwnProfile(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED)
      );
    }

    await this.userService.softDeleteUser(req.user.userId);
    return { message: "User soft deleted successfully" };
  }
}
