import { Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CleanupService } from "./cleanup.service";

@ApiTags("cleanup")
@Controller("cleanup")
export class CleanupController {
  constructor(private readonly cleanupService: CleanupService) {}

  @Post("remove-test-user")
  @ApiOperation({ summary: "Remove test user and related profiles" })
  @ApiResponse({
    status: 200,
    description: "Test user and all related profiles removed successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Test user not found",
  })
  async removeTestUser() {
    return this.cleanupService.removeTestUser("zeninguem@email.com");
  }
}
