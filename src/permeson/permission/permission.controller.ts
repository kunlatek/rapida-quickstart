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
import { Permission } from './permission.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionDto, FormPermissionDto } from './permission.dto';
import { ObjectId } from 'mongodb';
import { HttpArrayResponseDto } from 'src/base/base.dto';
import { AuthGuard } from 'src/auth.guard';

@ApiTags('Permeson/Permission')
@Controller('permissions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  @ApiOperation({ summary: 'Create permission' })
  @ApiBody({ type: FormPermissionDto })
  @ApiResponse({
    status: 201,
    description: 'Permission',
    type: PermissionDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() data: FormPermissionDto) {
    return this.permissionRepository.save(data);
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'All permissions',
    type: HttpArrayResponseDto(PermissionDto),
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
    return this.permissionRepository
      .findAndCount({
        skip: page * limit,
        take: limit,
      })
      .then(([result, total]) => ({ result, page, total }));
  }

  @ApiOperation({ summary: 'Get a specifique permission by id' })
  @ApiResponse({
    status: 200,
    description: 'Specifique permission',
    type: PermissionDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  @ApiOperation({ summary: 'Update a specifique permission by id' })
  @ApiBody({ type: FormPermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Specifique permission',
    type: PermissionDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: FormPermissionDto) {
    return this.permissionRepository.update({ _id: new ObjectId(id) }, data);
  }

  @ApiOperation({ summary: 'Delete a specifique permission by id' })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.permissionRepository.delete(id);
  }
}
