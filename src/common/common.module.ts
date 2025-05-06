import { Module } from '@nestjs/common';
import { ErrorService } from './services/error.service';
import { CascadeService } from './services/cascade.service';

@Module({
  providers: [ErrorService, CascadeService],
  exports: [ErrorService, CascadeService],
})
export class CommonModule { }
