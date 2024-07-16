import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InvitationDto, FormInvitationDto } from './invitation.dto';
import { ObjectId } from 'mongodb';
import { HttpArrayResponseDto } from 'src/base/base.dto';
import { AuthGuard } from 'src/auth.guard';

@ApiTags('Permeson/Invitation')
@Controller('invitations')
@UseGuards(AuthGuard)
export class InvitationController {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
  ) {}

  @ApiOperation({ summary: 'Create invitation' })
  @ApiBody({ type: FormInvitationDto })
  @ApiResponse({
    status: 201,
    description: 'Invitation',
    type: InvitationDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() data: FormInvitationDto) {
    return this.invitationRepository.save(data);
  }

  @ApiOperation({ summary: 'Get all invitations' })
  @ApiResponse({
    status: 200,
    description: 'All invitations',
    type: HttpArrayResponseDto(InvitationDto),
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(100), ParseIntPipe)
    limit: number,
  ) {
    return this.invitationRepository
      .findAndCount({
        skip: page * limit,
        take: limit,
      })
      .then(([result, total]) => ({ result, page, total }));
  }

  @ApiOperation({ summary: 'Get a specifique invitation by id' })
  @ApiResponse({
    status: 200,
    description: 'Specifique invitation',
    type: InvitationDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  @ApiOperation({ summary: 'Update a specifique invitation by id' })
  @ApiBody({ type: FormInvitationDto })
  @ApiResponse({
    status: 200,
    description: 'Specifique invitation',
    type: InvitationDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: FormInvitationDto) {
    return this.invitationRepository.save({ _id: new ObjectId(id), ...data });
  }

  @ApiOperation({ summary: 'Delete a specifique invitation by id' })
  @ApiResponse({
    status: 200,
    description: 'Invitation deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.invitationRepository.delete(id);
  }
}
