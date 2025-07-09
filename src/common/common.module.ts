import { Module } from "@nestjs/common";
import { ErrorService } from "./services/error.service";
import { CascadeService } from "./services/cascade.service";
import { DiscordLoggerService } from "./services/discord-logger.service";
import { UploadService } from "./services/upload.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [
    ErrorService,
    CascadeService,
    DiscordLoggerService,
    UploadService,
  ],
  exports: [ErrorService, CascadeService, DiscordLoggerService, UploadService],
})
export class CommonModule {}
