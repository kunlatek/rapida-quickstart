import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { JwtService } from '@nestjs/jwt';
import { Module as ModuleEntity } from '../module/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity, Profile, Role, Permission]),
  ],
  controllers: [ProfileController],
  providers: [JwtService],
})
export class ProfileModule {}
