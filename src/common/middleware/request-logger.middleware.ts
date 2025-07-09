import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { CustomLogger } from "../logging/logging.service";
import { v4 as uuidv4 } from "uuid";
import { DiscordLoggerService } from "../services/discord-logger.service";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: CustomLogger;

  constructor(private readonly discordLogger: DiscordLoggerService) {
    this.logger = new CustomLogger("RequestLogger");
  }

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    req["requestId"] = requestId;

    this.logRequest(req);

    const originalSend = res.send;
    const self = this;
    res.send = function (body) {
      const responseTime = Date.now() - req["startTime"];
      const statusCode = res.statusCode;

      const logger = new CustomLogger("RequestLogger");
      if (statusCode >= 400) {
        const errorMessage = `Response: ${req.method} ${req.originalUrl} - Status: ${statusCode} - Time: ${responseTime}ms - RequestId: ${requestId} - Body: ${JSON.stringify(body)}`;

        logger.error(errorMessage);

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

    req["startTime"] = Date.now();

    next();
  }

  private logRequest(req: Request) {
    const requestData = {
      method: req.method,
      url: req.originalUrl,
      headers: this.sanitizeHeaders(req.headers),
      query: req.query,
      body: req.headers["content-type"]?.includes("multipart/form-data")
        ? "[multipart/form-data]"
        : this.sanitizeBody(req.body),
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    this.logger.log(
      `Request: ${req.method} ${
        req.originalUrl
      } - RequestId: ${req["requestId"]} - Data: ${JSON.stringify(requestData)}`
    );
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };

    delete sanitized.authorization;
    delete sanitized.cookie;
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };

    delete sanitized.password;
    delete sanitized.confirmPassword;
    delete sanitized.token;
    delete sanitized.refreshToken;
    return sanitized;
  }
}
