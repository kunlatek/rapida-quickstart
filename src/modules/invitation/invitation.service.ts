import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation, InvitationDocument } from './invitation.schema';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { EmailService } from './services/email.service';
import { InvitationMapper } from './mappers/invitation.mapper';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation.name) private invitationModel: Model<InvitationDocument>,
    private readonly emailService: EmailService,
  ) { }

  async create(createInvitationDto: CreateInvitationDto): Promise<InvitationResponseDto> {
    const { createdBy, ownerId, ...invitationData } = createInvitationDto;

    const existingInvitation = await this.invitationModel.findOne({ email: invitationData.email });
    if (existingInvitation) {
      throw new BadRequestException('An invitation already exists for this email');
    }

    const invitation = new this.invitationModel({
      ...invitationData,
      createdBy,
      ownerId: ownerId || createdBy,
    });
    await invitation.save();

    try {
      await this.emailService.sendInvitationEmail(invitation.email, invitation._id.toString());
    } catch (error) {
      throw new BadRequestException('Failed to send invitation email');
    }

    return InvitationMapper.toDto(invitation);
  }

  async findAll(ownerId: string, page: number = 1, limit: number = 10, sortBy: string = 'createdAt', sortDir: 'asc' | 'desc' = 'asc'): Promise<InvitationResponseDto[]> {
    const sortOptions = { [sortBy]: sortDir === 'asc' ? 1 : -1 } as const;
    const skip = (page - 1) * limit;
    const invitations = await this.invitationModel
      .find({ $or: [{ ownerId }, { createdBy: ownerId }] })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit).exec();
    return InvitationMapper.toDtoList(invitations);
  }

  async count(ownerId: string): Promise<number> {
    return this.invitationModel.countDocuments({ $or: [{ ownerId }, { createdBy: ownerId }] }).exec();
  }

  async findOne(id: string, ownerId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findOne({
      _id: id,
      $or: [{ ownerId }, { createdBy: ownerId }]
    }).exec();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    return InvitationMapper.toDto(invitation);
  }

  async findByEmail(email: string): Promise<InvitationResponseDto | null> {
    const invitation = await this.invitationModel.findOne({ email }).exec();

    return invitation ? InvitationMapper.toDto(invitation) : null;
  }

  async update(id: string, updateData: Partial<CreateInvitationDto>, ownerId: string): Promise<InvitationResponseDto> {
    const invitation = await this.findOne(id, ownerId);

    if (invitation.accepted) {
      throw new BadRequestException('Cannot update an accepted invitation');
    }

    if (updateData.email && updateData.email !== invitation.email) {
      throw new BadRequestException('Cannot change invitation email');
    }

    const { createdBy, ownerId: newOwnerId, ...updateFields } = updateData;
    const updatedInvitation = await this.invitationModel.findOneAndUpdate(
      { _id: id, ownerId },
      updateFields,
      { new: true }
    ).exec();

    return InvitationMapper.toDto(updatedInvitation);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const invitation = await this.findOne(id, ownerId);

    if (invitation.accepted) {
      throw new BadRequestException('Cannot delete an accepted invitation');
    }

    await this.invitationModel.findOneAndDelete({
      _id: id,
      ownerId
    }).exec();
  }

  async resendEmail(id: string, ownerId: string): Promise<void> {
    const invitation = await this.findOne(id, ownerId);

    if (invitation.accepted) {
      throw new BadRequestException('Cannot resend email for an accepted invitation');
    }

    try {
      await this.emailService.sendInvitationEmail(invitation.email, invitation.id);
    } catch (error) {
      throw new BadRequestException('Failed to send invitation email');
    }
  }

  async acceptInvitation(id: string): Promise<void> {
    const invitation = await this.invitationModel.findById(id).exec();
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.accepted) {
      throw new BadRequestException('Invitation already accepted');
    }

    await this.invitationModel.findByIdAndUpdate(id, {
      accepted: true,
      acceptedAt: new Date()
    }).exec();
  }
} 