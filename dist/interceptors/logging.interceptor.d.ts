import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logDir;
    private readonly today;
    constructor();
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    private appendLog;
}
