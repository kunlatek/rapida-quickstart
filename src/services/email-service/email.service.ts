import * as nodemailer from 'nodemailer';
const fs = require('fs');
const path = require('path');

export function generateMailTemplate(template: string, data: object): string {
    const templatePath = path.join(__dirname, '..', '..', '..', 'src', 'services', 'email-service', 'email-templates', `${template}.html`);
    let newHtml = fs.readFileSync(templatePath, 'utf8');
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            newHtml = newHtml.replace(regex, data[key]);
        }
    }
    return newHtml;
}

export async function sendEmail({to, subject, html}:{to: string, subject: string, html: string}) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.SMTP_EMAIL || 'noreply.rapida@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'ekgwxlazvjjllfxf',
            },
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL || 'noreply.rapida@gmail.com',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.messageId);
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
    }
}