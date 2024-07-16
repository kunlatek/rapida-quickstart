import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Role } from '../role/role.entity';
import { JwtService } from '@nestjs/jwt';
import { Module as ModuleEntity } from '../module/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Permission, Role])],
  controllers: [PermissionController],
  providers: [JwtService],
})
export class PermissionModule {}
