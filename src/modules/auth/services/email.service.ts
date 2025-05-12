import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

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

    async sendForgotPasswordEmail(email: string) {
        const baseUrl = this.configService.get('BASE_URL');
        
        const token = this.jwtService.sign({ email }, { expiresIn: '1h' });

        const url = `${baseUrl}/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: this.configService.get('SMTP_FROM'),
            to: email,
            subject: 'Recuperação de senha',
            text: `Clique no link abaixo para resetar sua senha: ${url}`,
        });

        return {
            message: 'Email de recuperação de senha enviado com sucesso',
        };
    }
}