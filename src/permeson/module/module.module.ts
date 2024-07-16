import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './module.entity';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Role, Permission])],
  controllers: [ModuleController],
  providers: [JwtService],
})
export class ModuleModule {}
