import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InviteResponseDto } from './dto/invite-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, PartialType, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Invites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invites')
export class InviteController {
    constructor(private readonly inviteService: InviteService) { }

    @Post()
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Create a new invite' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createInviteDto: CreateInviteDto): Promise<InviteResponseDto> {
        return this.inviteService.create(createInviteDto);
    }

    @Get()
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Get all invites' })
    @ApiResponse({ 
        status: 200, 
        description: 'List of all invites',
        type: InviteResponseDto,
        isArray: true
    })
    findAll(): Promise<InviteResponseDto[]> {
        return this.inviteService.findAll();
    }

    @Get(':id')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Get invite by ID' })
    @ApiParam({ name: 'id', description: 'Invite ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Invite found',
        type: InviteResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Invite not found' })
    findOne(@Param('id') id: string): Promise<InviteResponseDto> {
        return this.inviteService.findOne(id);
    }

    @Patch(':id')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Update invite' })
    @ApiParam({ name: 'id', description: 'Invite ID' })
    @ApiBody({ type: PartialType(CreateInviteDto) })
    @ApiResponse({ 
        status: 200, 
        description: 'Invite updated successfully',
    })
    @ApiResponse({ status: 404, description: 'Invite not found' })
    update(
        @Param('id') id: string, 
        @Body() updateInviteDto: Partial<CreateInviteDto>
    ): Promise<InviteResponseDto> {
        return this.inviteService.update(id, updateInviteDto);
    }

    @Delete(':id')
    @ApiSecurity('jwt')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete invite' })
    @ApiParam({ name: 'id', description: 'Invite ID' })
    @ApiResponse({ status: 204, description: 'Invite deleted successfully' })
    @ApiResponse({ status: 404, description: 'Invite not found' })
    remove(@Param('id') id: string): Promise<void> {
        return this.inviteService.remove(id);
    }

    @Post(':id/resend')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Resend invite email' })
    @ApiParam({ name: 'id', description: 'Invite ID' })
    @ApiResponse({ 
        status: 200, 
        description: 'Invite email resent successfully'
    })
    @ApiResponse({ status: 404, description: 'Invite not found' })
    resendEmail(@Param('id') id: string): Promise<void> {
        return this.inviteService.resendEmail(id);
    }
}