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
    [Route("api/sms-code")]
    public class SmsCodeController : ControllerBase
    {
        private readonly ISmsService _smsService;

        public SmsCodeController(ISmsService smsService)
        {
            _smsService = smsService;
        }

        /// <summary>
        /// Send SMS verification code
        /// </summary>
        /// <param name="dto">SMS code data</param>
        /// <returns>Created SMS code</returns>
        /// <response code="200">SMS code sent successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="409">SMS code already sent</response>
        [HttpPost("send-sms")]
        public async Task<IActionResult> SendSms([FromBody] CreateSmsCodeDto dto)
        {
            try
            {
                var smsCode = await _smsService.CreateSmsCodeAsync(dto);
                return Ok(smsCode);
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
        /// Verify SMS code
        /// </summary>
        /// <param name="dto">Verification data</param>
        /// <returns>Verified SMS code</returns>
        /// <response code="200">SMS code verified successfully</response>
        /// <response code="400">Invalid SMS code or expired</response>
        /// <response code="404">SMS code not found</response>
        [HttpPost("verify-sms")]
        public async Task<IActionResult> VerifySms([FromBody] VerifySmsCodeDto dto)
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

    }
}
