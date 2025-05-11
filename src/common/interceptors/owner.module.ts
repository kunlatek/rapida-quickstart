import { Module } from '@nestjs/common';
import { OwnerInterceptor } from './owner.interceptor';
import { InviteModule } from '../../modules/invite/invite.module';

@Module({
  imports: [InviteModule],
  providers: [OwnerInterceptor],
  exports: [OwnerInterceptor],
})
export class OwnerModule {} 