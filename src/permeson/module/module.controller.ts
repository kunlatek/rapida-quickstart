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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './module.entity';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ModuleDto, FormModuleDto } from './module.dto';
import { ObjectId } from 'mongodb';
import { HttpArrayResponseDto } from 'src/base/base.dto';

@ApiTags('Permeson/Module')
@Controller('modules')
export class ModuleController {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  @ApiOperation({ summary: 'Create module' })
  @ApiBody({ type: FormModuleDto })
  @ApiResponse({
    status: 201,
    description: 'Module',
    type: ModuleDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() data: FormModuleDto) {
    return this.moduleRepository.save(data);
  }

  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({
    status: 200,
    description: 'All modules',
    type: HttpArrayResponseDto(ModuleDto),
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
    return this.moduleRepository
      .findAndCount({
        skip: page * limit,
        take: limit,
      })
      .then(([result, total]) => ({ result, page, total }));
  }

  @ApiOperation({ summary: 'Get a specifique module by id' })
  @ApiResponse({
    status: 200,
    description: 'Specifique module',
    type: ModuleDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  @ApiOperation({ summary: 'Update a specifique module by id' })
  @ApiBody({ type: FormModuleDto })
  @ApiResponse({
    status: 200,
    description: 'Specifique module',
    type: ModuleDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: FormModuleDto) {
    return this.moduleRepository.save({ _id: new ObjectId(id), ...data });
  }

  @ApiOperation({ summary: 'Delete a specifique module by id' })
  @ApiResponse({
    status: 200,
    description: 'Module deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.moduleRepository.delete(id);
  }
}
