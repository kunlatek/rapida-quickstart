import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './modules/profile/profile.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures that environment variables are loaded globally
      envFilePath: '.env', // Explicitly sets the .env file location
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CommonModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingInterceptor],
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
