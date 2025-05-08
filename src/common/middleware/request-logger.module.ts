import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLoggerMiddleware } from './request-logger.middleware';
import { CommonModule } from '../common.module';

@Module({
  imports: [CommonModule],
  providers: [RequestLoggerMiddleware],
  exports: [RequestLoggerMiddleware],
})
export class RequestLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
} 