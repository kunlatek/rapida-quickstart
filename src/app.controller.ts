import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { I18nLang } from "nestjs-i18n";

@ApiTags("root")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Get Hello message" })
  @ApiResponse({
    status: 200,
    description: "Returns a Hello World string",
  })
  getHello(@I18nLang() lang: string): string {
    return this.appService.getHello(lang);
  }
}
