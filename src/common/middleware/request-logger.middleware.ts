import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from '../logging/logging.service';
import { v4 as uuidv4 } from 'uuid';
import { DiscordLoggerService } from '../services/discord-logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: CustomLogger;

  constructor(private readonly discordLogger: DiscordLoggerService) {
    this.logger = new CustomLogger('RequestLogger');
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Generate a unique request ID
    const requestId = uuidv4();
    req['requestId'] = requestId;

    // Log request start
    this.logRequest(req);

    // Capture response data
    const originalSend = res.send;
    const self = this; // Store reference to this
    res.send = function (body) {
      // Log response
      const responseTime = Date.now() - req['startTime'];
      const statusCode = res.statusCode;
      
      const logger = new CustomLogger('RequestLogger');
      if (statusCode >= 400) {
        const errorMessage = `Response: ${req.method} ${req.originalUrl} - Status: ${statusCode} - Time: ${responseTime}ms - RequestId: ${requestId} - Body: ${JSON.stringify(body)}`;
        // Log to file
        logger.error(errorMessage);
        
        // Send to Discord only for 404 and 500 errors
        if (statusCode === 404 || statusCode === 500) {
          const error = new Error(body);
          error.name = statusCode.toString();
          self.discordLogger.logError(error);
        }
      } else {
        logger.log(
          `Response: ${req.method} ${req.originalUrl} - Status: ${statusCode} - Time: ${responseTime}ms - RequestId: ${requestId} - Body: ${JSON.stringify(body)}`
        );
      }

      return originalSend.call(this, body);
    };

    // Set start time
    req['startTime'] = Date.now();

    next();
  }

  private logRequest(req: Request) {
    const requestData = {
      method: req.method,
      url: req.originalUrl,
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      body: this.sanitizeBody(req.body),
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    this.logger.log(
      `Request: ${req.method} ${req.originalUrl} - RequestId: ${req['requestId']} - Data: ${JSON.stringify(requestData)}`
    );
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    // Remove sensitive headers
    delete sanitized.authorization;
    delete sanitized.cookie;
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.confirmPassword;
    delete sanitized.token;
    delete sanitized.refreshToken;
    return sanitized;
  }
} 