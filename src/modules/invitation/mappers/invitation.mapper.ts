import { Invitation } from '../invitation.schema';
import { InvitationResponseDto } from '../dto/invitation-response.dto';

export class InvitationMapper {
  static toDto(invitation: Invitation): InvitationResponseDto {
    return {
      id: invitation._id.toString(),
      email: invitation.email,
      role: invitation.role,
      accepted: invitation.accepted,
      acceptedAt: invitation.acceptedAt,
      createdAt: invitation.createdAt,
      updatedAt: invitation.updatedAt,
      createdBy: invitation.createdBy,
      ownerId: invitation.ownerId,
    };
  }

  static toDtoList(invitations: Invitation[]): InvitationResponseDto[] {
    return invitations.map(invitation => this.toDto(invitation));
  }
} 