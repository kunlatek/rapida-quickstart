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
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendForgotPasswordEmail(email: string) {
        const baseUrl = this.configService.get('BASE_URL');
        
        const token = this.jwtService.sign({ email }, { expiresIn: '1h' });

        const url = `${baseUrl}/auth/reset-password/${token}`;

        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Recuperação de senha',
            text: `Clique no link abaixo para resetar sua senha: ${url}`,
        });

        return {
            message: 'Email de recuperação de senha enviado com sucesso',
        };
    }
}