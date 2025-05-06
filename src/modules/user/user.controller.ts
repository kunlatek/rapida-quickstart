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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiSecurity } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/enums/user-role.enum";
import { ErrorService } from "src/common/services/error.service";
import { ErrorCode } from "src/common/constants/error-code.enum";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) { }

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

  @Get()
  @ApiSecurity('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiSecurity('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get a user by ID" })
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @ApiSecurity('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update a user by ID" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  @ApiSecurity('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Soft delete a user by ID" })
  async softDeleteUser(@Param("id") id: string) {
    await this.userService.softDeleteUser(id);
    return { message: "User soft deleted successfully" };
  }

  @Delete()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: "Soft delete own profile" })
  async softDeleteOwnProfile(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    await this.userService.softDeleteUser(req.user.userId);
    return { message: "User soft deleted successfully" };
  }

  @Patch('restore')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: "Restore own soft-deleted profile" })
  async restoreOwnProfile(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }
    await this.userService.restoreUser(req.user.userId);
    return { message: "User restored successfully" };
  }
}
