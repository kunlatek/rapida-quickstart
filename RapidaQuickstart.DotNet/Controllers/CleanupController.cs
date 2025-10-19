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
        /// Remove test users from the system
        /// </summary>
        /// <returns>Number of test users removed</returns>
        /// <response code="200">Test users removed successfully</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("test-users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveTestUsers()
        {
            try
            {
                var count = await _cleanupService.RemoveTestUsersAsync();
                return Ok(new { message = $"Removed {count} test users", count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Remove expired invitations from the system
        /// </summary>
        /// <returns>Number of expired invitations removed</returns>
        /// <response code="200">Expired invitations removed successfully</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("expired-invitations")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveExpiredInvitations()
        {
            try
            {
                var count = await _cleanupService.RemoveExpiredInvitationsAsync();
                return Ok(new { message = $"Removed {count} expired invitations", count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Remove expired SMS codes from the system
        /// </summary>
        /// <returns>Number of expired SMS codes removed</returns>
        /// <response code="200">Expired SMS codes removed successfully</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("expired-sms-codes")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveExpiredSmsCodes()
        {
            try
            {
                var count = await _cleanupService.RemoveExpiredSmsCodesAsync();
                return Ok(new { message = $"Removed {count} expired SMS codes", count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Remove old logs from the system
        /// </summary>
        /// <param name="daysOld">Number of days old logs to remove (default: 30)</param>
        /// <returns>Number of old logs removed</returns>
        /// <response code="200">Old logs removed successfully</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("old-logs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveOldLogs([FromQuery] int daysOld = 30)
        {
            try
            {
                var count = await _cleanupService.RemoveOldLogsAsync(daysOld);
                return Ok(new { message = $"Removed {count} old logs", count, daysOld });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Perform full cleanup of the system
        /// </summary>
        /// <returns>Cleanup summary</returns>
        /// <response code="200">Full cleanup completed successfully</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("full")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PerformFullCleanup()
        {
            try
            {
                var summary = await _cleanupService.PerformFullCleanupAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get cleanup status and statistics
        /// </summary>
        /// <returns>Cleanup status</returns>
        /// <response code="200">Returns cleanup status</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCleanupStatus()
        {
            try
            {
                // This would typically return statistics about the system
                // For now, we'll return a simple status
                var status = new
                {
                    timestamp = DateTime.UtcNow,
                    status = "System is running",
                    lastCleanup = "Not available",
                    recommendations = new[]
                    {
                        "Run full cleanup weekly",
                        "Monitor expired invitations",
                        "Clean up test data regularly"
                    }
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
