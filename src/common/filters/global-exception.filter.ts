import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || "Internal server error";
    let errors: Record<string, string> | null = null;

    // Specific handling for class-validator exceptions from ValidationPipe
    if (
      status === HttpStatus.BAD_REQUEST &&
      Array.isArray(exception.response?.message)
    ) {
      message = "Validation failed";
      errors = {};
      exception.response.message.forEach((err: any) => {
        if (err.property && err.constraints) {
          errors[err.property] = Object.values(err.constraints)[0] as string;
        }
      });
    } else if (exception instanceof mongoose.Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Validation failed";
      errors = {};
      for (const field in exception.errors) {
        if (exception.errors[field]) {
          errors[field] = exception.errors[field].message;
        }
      }
    } else if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      const field = Object.keys(exception.keyValue)[0];
      const value = exception.keyValue[field];
      message = `The value '${value}' for the field '${field}' is already in use.`;
    }

    this.logger.error(
      `[${status}] ${message}`,
      errors ? JSON.stringify(errors) : exception.stack
    );

    const responseBody: any = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      responseBody.errors = errors;
    }

    response.status(status).json(responseBody);
  }
}
