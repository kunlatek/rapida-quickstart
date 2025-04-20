import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import {
  CompanyProfileFilterDto,
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from './dto/company-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ErrorService } from '../../common/services/error.service';
import { ErrorCode } from '../../common/constants/error-code.enum';
import { CompanyProfile } from './schemas/company-profile.schema';
import { ActiveRoleGuard } from 'src/common/guards/active-role.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

/**
 * Controller responsible for managing company profiles.
 * All routes are protected by JWT authentication.
 */
@ApiTags('company-profiles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('company-profiles')
export class CompanyProfileController {
  constructor(
    private readonly companyProfileService: CompanyProfileService,
    private readonly errorService: ErrorService,
  ) {}

  /**
   * Creates a new company profile.
   * Requires JWT authentication.
   */
  @Post()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Create a company profile' })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
  })
  async create(@Body() dto: CreateCompanyProfileDto, @Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    dto.userId = req.user.userId;
    return this.companyProfileService.createProfile(dto);
  }

  @Get()
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Retrieve all company profiles with filtering and pagination',
  })
  @ApiResponse({ status: 200, description: 'List of all company profiles' })
  @UseGuards(AuthGuard('jwt'), ActiveRoleGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() filterDto: CompanyProfileFilterDto,
  ): Promise<{ data: CompanyProfile[]; total: number }> {
    return this.companyProfileService.findAll(filterDto);
  }

  /**
   * Finds a company profile by ID.
   */
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Get a company profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
  })
  async findById(@Param('id') id: string) {
    return this.companyProfileService.findProfileById(id);
  }

  /**
   * Retrieves a company profile by user ID.
   */
  @Get('user/:userId')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Retrieve a company profile by userId' })
  @ApiParam({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Company profile found' })
  @ApiResponse({ status: 404, description: 'Company profile not found' })
  async findByUserId(@Param('userId') userId: string, @Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.companyProfileService.findProfileByUserId(userId);
  }

  /**
   * Updates a company profile by ID.
   */
  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Update a company profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyProfileDto,
    @Req() req,
  ) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    return this.companyProfileService.updateProfile(id, dto, req.user.userId);
  }

  /**
   * Deletes a company profile by ID.
   */
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiOperation({ summary: 'Delete a company profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile deleted successfully',
  })
  async remove(@Param('id') id: string, @Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    return this.companyProfileService.deleteProfile(id, req.user.userId);
  }
}
