import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invite, InviteDocument } from './invite.schema';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InviteResponseDto } from './dto/invite-response.dto';
import { EmailService } from './services/email.service';
import { InviteMapper } from './mappers/invite.mapper';

@Injectable()
export class InviteService {
  constructor(
    @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    private readonly emailService: EmailService,
  ) { }

  async create(createInviteDto: CreateInviteDto): Promise<InviteResponseDto> {
    const existingInvite = await this.inviteModel.findOne({ email: createInviteDto.email });
    if (existingInvite) {
      throw new BadRequestException('An invite already exists for this email');
    }

    const invite = new this.inviteModel(createInviteDto);
    await invite.save();

    try {
      await this.emailService.sendInviteEmail(invite.email, invite._id.toString());
    } catch (error) {
      throw new BadRequestException('Failed to send invite email');
    }

    return InviteMapper.toDto(invite);
  }

  async findAll(): Promise<InviteResponseDto[]> {
    const invites = await this.inviteModel.find().exec();
    return InviteMapper.toDtoList(invites);
  }

  async findOne(id: string): Promise<InviteResponseDto> {
    const invite = await this.inviteModel.findById(id).exec();
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }
    return InviteMapper.toDto(invite);
  }

  async findByUserId(userId: string): Promise<InviteResponseDto | null> {
    const invite = await this.inviteModel.findOne({ 
      email: userId,
      accepted: true 
    }).exec();
    
    return invite ? InviteMapper.toDto(invite) : null;
  }

  async update(id: string, updateData: Partial<CreateInviteDto>): Promise<InviteResponseDto> {
    const invite = await this.findOne(id);

    if (invite.accepted) {
      throw new BadRequestException('Cannot update an accepted invite');
    }

    if (updateData.email && updateData.email !== invite.email) {
      throw new BadRequestException('Cannot change invite email');
    }

    const updatedInvite = await this.inviteModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();

    return InviteMapper.toDto(updatedInvite);
  }

  async remove(id: string): Promise<void> {
    const invite = await this.findOne(id);

    if (invite.accepted) {
      throw new BadRequestException('Cannot delete an accepted invite');
    }

    await this.inviteModel.findByIdAndDelete(id).exec();
  }

  async resendEmail(id: string): Promise<void> {
    const invite = await this.findOne(id);

    if (invite.accepted) {
      throw new BadRequestException('Cannot resend email for an accepted invite');
    }

    try {
      await this.emailService.sendInviteEmail(invite.email, invite.id);
    } catch (error) {
      throw new BadRequestException('Failed to send invite email');
    }
  }

  async acceptInvite(id: string): Promise<void> {
    const invite = await this.findOne(id);

    if (invite.accepted) {
      throw new BadRequestException('Invite already accepted');
    }

    await this.inviteModel.findByIdAndUpdate(id, { 
      accepted: true,
      acceptedAt: new Date()
    }).exec();
  }
} 