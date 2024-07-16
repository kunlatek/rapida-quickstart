import { Module } from '@nestjs/common';
import { ModuleModule } from './module/module.module';
import { PermissionModule } from './permission/permission.module';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [ModuleModule, PermissionModule, InvitationModule],
})
export class PermesonModule {}
