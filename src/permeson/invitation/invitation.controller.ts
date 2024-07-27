import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InvitationDto, FormInvitationDto } from './invitation.dto';
import { ObjectId } from 'mongodb';
import { HttpArrayResponseDto } from 'src/base/base.dto';
import { AuthGuard } from 'src/auth.guard';
import {
  generateMailTemplate,
  sendEmail,
} from 'src/services/email-service/email.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Permeson/Invitation')
@Controller('invitations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InvitationController {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,

    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Create invitation' })
  @ApiBody({ type: FormInvitationDto })
  @ApiResponse({
    status: 201,
    description: 'Invitation',
    type: InvitationDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() data: FormInvitationDto) {
    return this.invitationRepository
      .findOneBy({ email: data.email })
      .then((existingInvitation) => {
        if (existingInvitation)
          throw new ConflictException('Invitation already exists');

        return this.invitationRepository.save(data).then((result) =>
          sendEmail({
            to: result.email,
            subject: `Convite para o ${process.env.APP_NAME}`,
            html: generateMailTemplate('invitation-email', {
              app: process.env.APP_NAME,
              baseUrl: process.env.FRONTEND_URL,
              email: result.email,
              invitationToken: this.jwtService.sign(
                { invitationId: result._id.toString() },
                { secret: process.env.JWT_SECRET, expiresIn: '1h' },
              ),
            }),
          }),
        );
      });
  }

  @ApiOperation({ summary: 'Get all invitations' })
  @ApiResponse({
    status: 200,
    description: 'All invitations',
    type: HttpArrayResponseDto(InvitationDto),
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(100), ParseIntPipe)
    limit: number,
  ) {
    return this.invitationRepository
      .findAndCount({
        skip: page * limit,
        take: limit,
      })
      .then(([result, total]) => ({ result, page, total }));
  }

  @ApiOperation({ summary: 'Get a specifique invitation by id' })
  @ApiResponse({
    status: 200,
    description: 'Specifique invitation',
    type: InvitationDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  @ApiOperation({ summary: 'Update a specifique invitation by id' })
  @ApiBody({ type: FormInvitationDto })
  @ApiResponse({
    status: 200,
    description: 'Specifique invitation',
    type: InvitationDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: FormInvitationDto) {
    return this.invitationRepository.update({ _id: new ObjectId(id) }, data);
  }

  @ApiOperation({ summary: 'Delete a specifique invitation by id' })
  @ApiResponse({
    status: 200,
    description: 'Invitation deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.invitationRepository.delete(id);
  }

  @ApiOperation({ summary: 'Send invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation sent',
  })
  @Post(':id/send')
  async sendInvitation(@Param('id') id: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');

    const emailContent = generateMailTemplate('invitation-email', {
      app: process.env.APP_NAME,
      baseUrl: process.env.FRONTEND_URL,
      email: invitation.email,
      invitationToken: this.jwtService.sign(
        { invitationId: invitation._id.toString() },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      ),
    });

    await sendEmail({
      to: invitation.email,
      subject: `Convite para o ${process.env.APP_NAME}`,
      html: emailContent,
    });

    return { message: 'Invitation sent' };
  }
}
