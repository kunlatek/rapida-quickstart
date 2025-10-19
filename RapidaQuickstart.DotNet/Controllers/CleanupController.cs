using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.Services;

namespace RapidaQuickstart.DotNet.Controllers
{
    /// <summary>
    /// Cleanup and maintenance endpoints
    /// </summary>
    [ApiController]
    [Route("api/cleanup")]
    public class CleanupController : ControllerBase
    {
        private readonly ICleanupService _cleanupService;

        public CleanupController(ICleanupService cleanupService)
        {
            _cleanupService = cleanupService;
        }

        /// <summary>
        /// Remove test user and related profiles
        /// </summary>
        /// <returns>Success message</returns>
        /// <response code="200">Test user and all related profiles removed successfully</response>
        /// <response code="404">Test user not found</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("remove-test-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveTestUser()
        {
            try
            {
                var count = await _cleanupService.RemoveTestUserAsync();
                return Ok(new { message = $"Removed {count} test user", count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}
