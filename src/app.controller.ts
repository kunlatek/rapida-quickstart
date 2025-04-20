import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a Hello World string',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
