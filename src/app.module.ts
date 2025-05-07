import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './modules/profile/profile.module';
import { CommonModule } from './common/common.module';
import { LoggingModule } from './common/logging/logging.module';
import { UserModule } from './modules/user/user.module';
import { RequestLoggerModule } from './common/middleware/request-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures that environment variables are loaded globally
      envFilePath: '.env', // Explicitly sets the .env file location
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CommonModule,
    LoggingModule,
    AuthModule,
    UserModule,
    ProfileModule,
    RequestLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('🔹 AppModule Initialized');
    console.log(
      '🔹 Loaded JWT_SECRET:',
      process.env.JWT_SECRET ? '✅ Present' : '❌ Not Found',
    );
  }
}
