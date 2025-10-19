using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Services;
using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Controllers
{
    /// <summary>
    /// Person profile management endpoints
    /// </summary>
    [ApiController]
    [Route("api/person-profiles")]
    public class PersonProfileController : ControllerBase
    {
        private readonly IPersonProfileService _personProfileService;

        public PersonProfileController(IPersonProfileService personProfileService)
        {
            _personProfileService = personProfileService;
        }

        /// <summary>
        /// Create a new person profile
        /// </summary>
        /// <param name="dto">Person profile data</param>
        /// <returns>Created person profile</returns>
        /// <response code="201">Person profile created successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized</response>
        [HttpPost]
        [Authorize(Roles = "Person")]
        public async Task<IActionResult> CreateProfile([FromBody] CreatePersonProfileDto dto)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                dto.UserId = userId;
                var profile = await _personProfileService.CreateProfileAsync(dto);
                return CreatedAtAction(nameof(GetProfileById), new { id = profile.Id }, profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all person profiles with filtering and pagination
        /// </summary>
        /// <param name="filterDto">Filter and pagination parameters</param>
        /// <returns>Paginated list of person profiles</returns>
        /// <response code="200">Returns paginated person profiles</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllProfiles([FromQuery] PersonProfileFilterDto filterDto)
        {
            try
            {
                var (data, total) = await _personProfileService.FindAllAsync(filterDto);
                return Ok(new
                {
                    data,
                    total,
                    page = filterDto.Page,
                    limit = filterDto.Limit,
                    totalPages = (int)Math.Ceiling((double)total / filterDto.Limit)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get person profile by ID
        /// </summary>
        /// <param name="id">Profile ID</param>
        /// <returns>Person profile</returns>
        /// <response code="200">Returns person profile</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfileById(string id)
        {
            try
            {
                var profile = await _personProfileService.FindProfileByIdAsync(id);
                if (profile == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get person profile by user ID
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>Person profile</returns>
        /// <response code="200">Returns person profile</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfileByUserId(string userId)
        {
            try
            {
                var profile = await _personProfileService.FindProfileByUserIdAsync(userId);
                if (profile == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get current user's person profile
        /// </summary>
        /// <returns>Current user's person profile</returns>
        /// <response code="200">Returns person profile</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("me")]
        [Authorize(Roles = "Person")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var profile = await _personProfileService.FindProfileByUserIdAsync(userId);
                if (profile == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update person profile
        /// </summary>
        /// <param name="id">Profile ID</param>
        /// <param name="dto">Updated profile data</param>
        /// <returns>Updated person profile</returns>
        /// <response code="200">Profile updated successfully</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="400">Invalid request data</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "Person")]
        public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdatePersonProfileDto dto)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var profile = await _personProfileService.UpdateProfileAsync(id, dto, userId);
                return Ok(profile);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete person profile
        /// </summary>
        /// <param name="id">Profile ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Profile deleted successfully</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Person")]
        public async Task<IActionResult> DeleteProfile(string id)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                await _personProfileService.DeleteProfileAsync(id, userId);
                return Ok(new { message = "Profile deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
