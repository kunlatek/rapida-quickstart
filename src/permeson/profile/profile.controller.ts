import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileDto, FormProfileDto } from './profile.dto';
import { AuthGuard } from 'src/auth.guard';

@ApiTags('Permeson/Profile')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  @ApiOperation({ summary: 'Get a user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile',
    type: ProfileDto,
  })
  @Get(':userId/profile')
  findOne(@Param('userId') userId: string) {
    return this.profileRepository.findOne({
      where: { user: userId },
    });
  }

  @ApiOperation({ summary: 'Update a profile' })
  @ApiBody({ type: FormProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile',
    type: ProfileDto,
  })
  @Patch(':userId/profile')
  async update(@Param('userId') userId: string, @Body() data: FormProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { user: userId },
    });
    if (!profile) {
      return this.profileRepository.save(data);
    }
    return this.profileRepository.update({ user: userId }, data);
  }
}
