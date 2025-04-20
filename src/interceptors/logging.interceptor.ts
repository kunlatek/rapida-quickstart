import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import * as os from 'os';

/**
 * Custom interceptor that logs HTTP request and response data
 * into two JSON log files: one for regular logs and one for errors.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logDir = join(process.cwd(), 'logs');
  private readonly today = new Date().toISOString().split('T')[0]; // e.g., 2025-03-27

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const method = request.method;
    const url = request.originalUrl;
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];
    const body = request.body;

    return next.handle().pipe(
      tap(() => {
        const log = {
          timestamp: new Date().toISOString(),
          level: 'info',
          method,
          url,
          statusCode: response.statusCode,
          ip,
          userAgent,
          responseTime: `${Date.now() - now}ms`,
        };

        this.appendLog(log, false);
      }),
      catchError((err) => {
        const errorLog = {
          timestamp: new Date().toISOString(),
          level: 'error',
          method,
          url,
          statusCode: response.statusCode || 500,
          ip,
          userAgent,
          responseTime: `${Date.now() - now}ms`,
          error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
          requestBody: body,
        };

        this.appendLog(errorLog, true);
        throw err;
      }),
    );
  }

  private appendLog(log: Record<string, any>, isError = false): void {
    const file = join(
      this.logDir,
      isError ? `error-${this.today}.log` : `app-${this.today}.log`,
    );
    fs.appendFileSync(file, JSON.stringify(log) + os.EOL);
  }
}
