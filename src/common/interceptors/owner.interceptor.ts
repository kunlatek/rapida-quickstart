import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { InviteService } from '../../modules/invite/invite.service';

@Injectable()
export class OwnerInterceptor implements NestInterceptor {
  constructor(private readonly inviteService: InviteService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (request.method === 'POST' && user) {
      const body = request.body;

      body.createdBy = user.sub;

      const invite = await this.inviteService.findByUserId(user.sub);
      if (invite) {
        body.ownerId = invite.createdBy;
      }
    }

    return next.handle();
  }
} 