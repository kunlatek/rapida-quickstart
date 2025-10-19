using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Services;
using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Controllers
{
    /// <summary>
    /// Company profile management endpoints
    /// </summary>
    [ApiController]
    [Route("api/company-profiles")]
    public class CompanyProfileController : ControllerBase
    {
        private readonly ICompanyProfileService _companyProfileService;

        public CompanyProfileController(ICompanyProfileService companyProfileService)
        {
            _companyProfileService = companyProfileService;
        }

        /// <summary>
        /// Create a new company profile
        /// </summary>
        /// <param name="dto">Company profile data</param>
        /// <returns>Created company profile</returns>
        /// <response code="201">Company profile created successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized</response>
        [HttpPost]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> CreateProfile([FromBody] CreateCompanyProfileDto dto)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                dto.UserId = userId;
                var profile = await _companyProfileService.CreateProfileAsync(dto);
                return CreatedAtAction(nameof(GetProfileById), new { id = profile.Id }, profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all company profiles with filtering and pagination
        /// </summary>
        /// <param name="filterDto">Filter and pagination parameters</param>
        /// <returns>Paginated list of company profiles</returns>
        /// <response code="200">Returns paginated company profiles</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllProfiles([FromQuery] CompanyProfileFilterDto filterDto)
        {
            try
            {
                var (data, total) = await _companyProfileService.FindAllAsync(filterDto);
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
        /// Get company profile by ID
        /// </summary>
        /// <param name="id">Profile ID</param>
        /// <returns>Company profile</returns>
        /// <response code="200">Returns company profile</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfileById(string id)
        {
            try
            {
                var profile = await _companyProfileService.FindProfileByIdAsync(id);
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
        /// Get company profile by user ID
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>Company profile</returns>
        /// <response code="200">Returns company profile</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProfileByUserId(string userId)
        {
            try
            {
                var profile = await _companyProfileService.FindProfileByUserIdAsync(userId);
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
        /// Get current user's company profile
        /// </summary>
        /// <returns>Current user's company profile</returns>
        /// <response code="200">Returns company profile</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("me")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var profile = await _companyProfileService.FindProfileByUserIdAsync(userId);
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
        /// Update company profile
        /// </summary>
        /// <param name="id">Profile ID</param>
        /// <param name="dto">Updated profile data</param>
        /// <returns>Updated company profile</returns>
        /// <response code="200">Profile updated successfully</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="400">Invalid request data</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdateCompanyProfileDto dto)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var profile = await _companyProfileService.UpdateProfileAsync(id, dto, userId);
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
        /// Delete company profile
        /// </summary>
        /// <param name="id">Profile ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Profile deleted successfully</response>
        /// <response code="404">Profile not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Company")]
        public async Task<IActionResult> DeleteProfile(string id)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                await _companyProfileService.DeleteProfileAsync(id, userId);
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
