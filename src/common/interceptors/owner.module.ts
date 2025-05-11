import { Module } from '@nestjs/common';
import { OwnerInterceptor } from './owner.interceptor';
import { InvitationModule } from '../../modules/invitation/invitation.module';

@Module({
  imports: [InvitationModule],
  providers: [OwnerInterceptor],
  exports: [OwnerInterceptor],
})
export class OwnerModule {} 