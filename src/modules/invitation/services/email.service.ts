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
      service: 'gmail',
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInvitationEmail(email: string, invitationId: string): Promise<void> {
    const baseUrl = this.configService.get('BASE_URL');
    const token = this.jwtService.sign(
      { email, invitationId },
      { expiresIn: '24h' },
    );

    const invitationUrl = `${baseUrl}/auth/invitation-register?email=${email}&token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
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