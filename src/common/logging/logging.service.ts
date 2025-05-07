import { Injectable, Logger, Scope } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends Logger implements LoggerService {
    private logger!: winston.Logger;
    private errorLogger!: winston.Logger;

    constructor(context?: string) {
        super(context);
        this.initializeLoggers();
    }

    private initializeLoggers() {
        // Ensure logs directory exists
        const logsDir = path.join(process.cwd(), 'logs');
        const errorLogsDir = path.join(logsDir, 'errors');
        
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
        if (!fs.existsSync(errorLogsDir)) {
            fs.mkdirSync(errorLogsDir);
        }

        // Configure console transport
        const consoleFormat = winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
                return `[${timestamp}] ${level} [${context}] ${message} ${
                    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                }`;
            })
        );

        // Configure file transport
        const fileFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        );

        // Create normal logger
        this.logger = winston.createLogger({
            level: 'info',
            format: fileFormat,
            transports: [
                // Console transport
                new winston.transports.Console({
                    format: consoleFormat,
                }),
                // File transport with daily rotation
                new winston.transports.DailyRotateFile({
                    filename: path.join(logsDir, 'app-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                    maxFiles: '14d',
                    zippedArchive: true,
                    auditFile: path.join(process.cwd(), '.audit.json'),
                }),
            ],
        });

        // Create error logger
        this.errorLogger = winston.createLogger({
            level: 'error',
            format: fileFormat,
            transports: [
                // Console transport
                new winston.transports.Console({
                    format: consoleFormat,
                }),
                // File transport with daily rotation
                new winston.transports.DailyRotateFile({
                    filename: path.join(errorLogsDir, 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                    maxFiles: '14d',
                    zippedArchive: true,
                    auditFile: path.join(process.cwd(), '.audit.json'),
                }),
            ],
        });
    }

    log(message: string, meta?: any) {
        const context = this.context;
        this.logger.info(message, { context, ...meta });
        super.log(message);
    }

    error(message: string, trace?: string, meta?: any) {
        const context = this.context;
        this.errorLogger.error(message, {
            context,
            trace,
            ...meta,
        });
        super.error(message, trace);
    }

    warn(message: string, meta?: any) {
        const context = this.context;
        this.logger.warn(message, { context, ...meta });
        super.warn(message);
    }

    debug(message: string, meta?: any) {
        const context = this.context;
        this.logger.debug(message, { context, ...meta });
        super.debug(message);
    }

    verbose(message: string, meta?: any) {
        const context = this.context;
        this.logger.verbose(message, { context, ...meta });
        super.verbose(message);
    }
} 