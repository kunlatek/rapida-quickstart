import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendInvitationEmail(email: string, invitationId: string): Promise<void> {
    const baseUrl = this.configService.get('BASE_URL');
    const token = this.jwtService.sign(
      { email, invitationId },
      { expiresIn: '24h' },
    );

    const invitationUrl = `${baseUrl}/signup?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Convite para participar da plataforma',
      html: `
        <h1>Você foi convidado!</h1>
        <p>Clique no link abaixo para aceitar o convite:</p>
        <a href="${invitationUrl}">Aceitar convite</a>
        <p>Este link expira em 24 horas.</p>
      `,
    });
  }
} 