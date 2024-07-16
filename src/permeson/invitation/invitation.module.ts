import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './invitation.entity';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { JwtService } from '@nestjs/jwt';
import { Module as ModuleEntity } from '../module/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, ModuleEntity, Role, Permission]),
  ],
  controllers: [InvitationController],
  providers: [JwtService],
})
export class InvitationModule {}
