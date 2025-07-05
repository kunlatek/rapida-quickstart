import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileModule } from "./modules/profile/profile.module";
import { CommonModule } from "./common/common.module";
import { LoggingModule } from "./common/logging/logging.module";
import { UserModule } from "./modules/user/user.module";
import { RequestLoggerModule } from "./common/middleware/request-logger.module";
import { InvitationModule } from "./modules/invitation/invitation.module";
import { OwnerModule } from "./common/interceptors/owner.module";
import { SmsCodeModule } from "./modules/smsCode/sms-code.module";
import { CleanupModule } from "./modules/cleanup/cleanup.module";
import { I18nModule, AcceptLanguageResolver, QueryResolver } from "nestjs-i18n";
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    CommonModule,
    LoggingModule,
    AuthModule,
    UserModule,
    ProfileModule,
    RequestLoggerModule,
    InvitationModule,
    OwnerModule,
    SmsCodeModule,
    CleanupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log("🔹 AppModule Initialized");
    console.log(
      "🔹 Loaded JWT_SECRET:",
      process.env.JWT_SECRET ? "✅ Present" : "❌ Not Found"
    );
  }
}
