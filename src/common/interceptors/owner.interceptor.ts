import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { InvitationService } from '../../modules/invitation/invitation.service';

@Injectable()
export class OwnerInterceptor implements NestInterceptor {
  constructor(private readonly invitationService: InvitationService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (request.method === 'POST' && user) {
      const body = request.body;

      body.createdBy = user.userId;

      const invitation = await this.invitationService.findByEmail(user.email);
      
      if (invitation) {
        body.ownerId = invitation.createdBy;
      } else {
        body.ownerId = user.userId;
      }
    }

    return next.handle();
  }
} 