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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveRoleGuard } from 'src/common/guards/active-role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

import {
  CreatePersonProfileDto,
  UpdatePersonProfileDto,
  PersonProfileFilterDto,
} from './dto/person-profile.dto';
import { PersonProfileService } from './person-profile.service';
import { PersonProfile } from './schemas/person-profile.schema';

@ApiTags('person-profiles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('person-profiles')
export class PersonProfileController {
  constructor(private readonly personProfileService: PersonProfileService) {}

  @Post()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Create a person profile' })
  @ApiResponse({
    status: 201,
    description: 'Person profile created successfully',
  })
  async create(
    @Req() req,
    @Body() createPersonProfileDto: CreatePersonProfileDto,
  ) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    createPersonProfileDto.userId = req.user.userId;
    return this.personProfileService.createProfile(createPersonProfileDto);
  }

  @Get()
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Retrieve all person profiles with filtering and pagination',
  })
  @ApiResponse({ status: 200, description: 'List of all person profiles' })
  @UseGuards(AuthGuard('jwt'), ActiveRoleGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() filterDto: PersonProfileFilterDto,
  ): Promise<{ data: PersonProfile[]; total: number }> {
    return this.personProfileService.findAll(filterDto);
  }

  @Get(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get a person profile by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Person profile found' })
  async getById(@Param('id') id: string, @Req() req) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.personProfileService.findProfileById(id);
  }

  @Get('user/:userId')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get a person profile by userId' })
  @ApiParam({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'Person profile found' })
  async findByUserId(@Param('userId') userId: string, @Req() req) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.personProfileService.findProfileByUserId(userId);
  }

  @Patch(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Update a person profile' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePersonProfileDto,
    @Req() req,
  ) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.personProfileService.updateProfile(
      id,
      updateDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Delete a person profile' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  async delete(@Param('id') id: string, @Req() req) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.personProfileService.deleteProfile(id, req.user.userId);
  }
}
