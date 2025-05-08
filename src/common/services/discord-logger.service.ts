import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DiscordLoggerService {
  private readonly webhookUrl: string;
  private readonly projectName: string;
  private readonly logger = new Logger(DiscordLoggerService.name);

  constructor(private readonly configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL');
    this.projectName = this.configService.get<string>('PROJECT_NAME') || 'Rapida Quickstart API';
  }

  private formatErrorMessage(message: string): string {
    try {
      // Tenta fazer parse do JSON
      const parsed = JSON.parse(message);
      // Formata o JSON com indentação
      return JSON.stringify(parsed, null, 2);
    } catch {
      // Se não for JSON, retorna a mensagem original
      return message;
    }
  }

  async logError(error: Error, context?: string): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn('Discord webhook URL is not configured. Error logs will not be sent to Discord.');
      return;
    }

    try {
      const embed = {
        title: `🚨 Error Log`,
        color: 0xFF0000, // Red color
        fields: [
          {
            name: 'Project',
            value: this.projectName,
            inline: false,
          },
          {
            name: 'Status Code',
            value: error.name,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      if (context) {
        embed.fields.push({
          name: 'Context',
          value: context,
          inline: false,
        });
      }

      if (error.message) {
        embed.fields.push({
          name: 'Error',
          value: `\`\`\`json\n${this.formatErrorMessage(error.message)}\n\`\`\``,
          inline: false,
        });
      }

      await axios.post(this.webhookUrl, {
        embeds: [embed],
      });
    } catch (err) {
      this.logger.error(`Failed to send error log to Discord: ${err.message}`);
    }
  }

  async logWarning(message: string, context?: string): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn('Discord webhook URL is not configured. Warning logs will not be sent to Discord.');
      return;
    }

    try {
      const embed = {
        title: `⚠️ Warning`,
        color: 0xFFA500, // Orange color
        fields: [
          {
            name: 'Project',
            value: this.projectName,
            inline: false,
          },
          {
            name: 'Message',
            value: message,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      if (context) {
        embed.fields.push({
          name: 'Context',
          value: context,
          inline: false,
        });
      }

      await axios.post(this.webhookUrl, {
        embeds: [embed],
      });
    } catch (err) {
      this.logger.error(`Failed to send warning log to Discord: ${err.message}`);
    }
  }
}