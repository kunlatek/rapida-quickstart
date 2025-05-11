import { Invite } from '../invite.schema';
import { InviteResponseDto } from '../dto/invite-response.dto';

export class InviteMapper {
  static toDto(invite: Invite): InviteResponseDto {
    return {
      id: invite._id.toString(),
      email: invite.email,
      createdBy: invite.createdBy.toString(),
      role: invite.role,
      accepted: invite.accepted,
      acceptedAt: invite.acceptedAt,
      createdAt: invite.createdAt,
      updatedAt: invite.updatedAt,
    };
  }

  static toDtoList(invites: Invite[]): InviteResponseDto[] {
    return invites.map(invite => this.toDto(invite));
  }
} 