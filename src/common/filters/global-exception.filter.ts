import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
  BadRequestException,
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
    let message = "An error occurred";
    let errors: Record<string, string> | null = null;

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message || "Validation failed";
      if (typeof exceptionResponse === "object" && exceptionResponse.errors) {
        errors = exceptionResponse.errors;
      } else if (Array.isArray(exceptionResponse.message)) {
        errors = {};
        exceptionResponse.message.forEach((err: any) => {
          if (err.property && err.constraints) {
            errors[err.property] = Object.values(err.constraints)[0] as string;
          }
        });
      }
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
    } else if (exception instanceof HttpException) {
      message = exception.message;
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
