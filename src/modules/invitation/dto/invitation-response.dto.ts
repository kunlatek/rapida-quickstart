import { ApiProperty } from '@nestjs/swagger';

export class InvitationResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do convite',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário convidado',
  })
  email: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Role do usuário convidado',
  })
  role: string;

  @ApiProperty({
    example: false,
    description: 'Status de aceitação do convite',
  })
  accepted: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Data de aceitação do convite',
    required: false,
  })
  acceptedAt?: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Data de criação do convite',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Data da última atualização do convite',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do usuário que criou o convite',
  })
  createdBy: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do usuário que é o dono do convite',
  })
  ownerId: string;
} 