import { Module } from '@nestjs/common';
import { ModuleModule } from './module/module.module';
import { PermissionModule } from './permission/permission.module';
import { InvitationModule } from './invitation/invitation.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ModuleModule, PermissionModule, InvitationModule, ProfileModule],
})
export class PermesonModule {}
