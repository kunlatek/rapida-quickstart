using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Services;

namespace RapidaQuickstart.DotNet.Controllers
{
    /// <summary>
    /// SMS code management endpoints
    /// </summary>
    [ApiController]
    [Route("api/sms-codes")]
    public class SmsCodeController : ControllerBase
    {
        private readonly ISmsService _smsService;

        public SmsCodeController(ISmsService smsService)
        {
            _smsService = smsService;
        }

        /// <summary>
        /// Create and send SMS verification code
        /// </summary>
        /// <param name="dto">SMS code data</param>
        /// <returns>Created SMS code</returns>
        /// <response code="201">SMS code created and sent successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="409">SMS code already sent</response>
        [HttpPost]
        public async Task<IActionResult> CreateSmsCode([FromBody] CreateSmsCodeDto dto)
        {
            try
            {
                var smsCode = await _smsService.CreateSmsCodeAsync(dto);
                return CreatedAtAction(nameof(GetSmsCodeById), new { id = smsCode.Id }, smsCode);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all SMS codes with filtering and pagination
        /// </summary>
        /// <param name="filterDto">Filter and pagination parameters</param>
        /// <returns>Paginated list of SMS codes</returns>
        /// <response code="200">Returns paginated SMS codes</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllSmsCodes([FromQuery] SmsCodeFilterDto filterDto)
        {
            try
            {
                var (data, total) = await _smsService.FindAllAsync(filterDto);
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
        /// Get SMS code by ID
        /// </summary>
        /// <param name="id">SMS code ID</param>
        /// <returns>SMS code</returns>
        /// <response code="200">Returns SMS code</response>
        /// <response code="404">SMS code not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSmsCodeById(string id)
        {
            try
            {
                var smsCode = await _smsService.FindSmsCodeByIdAsync(id);
                if (smsCode == null)
                {
                    return NotFound(new { message = "SMS code not found" });
                }
                return Ok(smsCode);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Verify SMS code
        /// </summary>
        /// <param name="dto">Verification data</param>
        /// <returns>Verified SMS code</returns>
        /// <response code="200">SMS code verified successfully</response>
        /// <response code="400">Invalid SMS code or expired</response>
        /// <response code="404">SMS code not found</response>
        [HttpPost("verify")]
        public async Task<IActionResult> VerifySmsCode([FromBody] VerifySmsCodeDto dto)
        {
            try
            {
                var smsCode = await _smsService.VerifySmsCodeAsync(dto);
                return Ok(smsCode);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete SMS code
        /// </summary>
        /// <param name="id">SMS code ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">SMS code deleted successfully</response>
        /// <response code="404">SMS code not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSmsCode(string id)
        {
            try
            {
                await _smsService.DeleteSmsCodeAsync(id);
                return Ok(new { message = "SMS code deleted successfully" });
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
        /// Check if phone number is verified
        /// </summary>
        /// <param name="phoneNumber">Phone number to check</param>
        /// <returns>Verification status</returns>
        /// <response code="200">Returns verification status</response>
        [HttpGet("check/{phoneNumber}")]
        public async Task<IActionResult> CheckPhoneVerification(string phoneNumber)
        {
            try
            {
                var isVerified = await _smsService.IsPhoneVerifiedAsync(phoneNumber);
                return Ok(new { phoneNumber, isVerified });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
