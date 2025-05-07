import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './logging.service';

@Global()
@Module({
    providers: [CustomLogger],
    exports: [CustomLogger],
})
export class LoggingModule {} 