import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLoggerMiddleware } from './request-logger.middleware';

@Module({
  providers: [RequestLoggerMiddleware],
  exports: [RequestLoggerMiddleware],
})
export class RequestLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
} 