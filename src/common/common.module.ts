import { Module } from '@nestjs/common';
import { ErrorService } from './services/error.service';
import { CascadeService } from './services/cascade.service';
import { DiscordLoggerService } from './services/discord-logger.service';

@Module({
  providers: [ErrorService, CascadeService, DiscordLoggerService],
  exports: [ErrorService, CascadeService, DiscordLoggerService],
})
export class CommonModule { }
