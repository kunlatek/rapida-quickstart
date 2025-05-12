import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SmsCodeController } from './sms-code.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../../common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsCode, SmsCodeSchema } from './sms-code.schema';
import { SmsCodeService } from './sms-code.service';

/**
 * Module responsible for handling SMS code.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error(
            '❌ CRITICAL FAILURE: JWT_SECRET is not defined in .env!',
          );
        }

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    CommonModule,
    MongooseModule.forFeature([{ name: SmsCode.name, schema: SmsCodeSchema }]),
  ],
  providers: [SmsCodeService],
  controllers: [SmsCodeController],
  exports: [PassportModule, JwtModule, SmsCodeService],
})
export class SmsCodeModule {}
