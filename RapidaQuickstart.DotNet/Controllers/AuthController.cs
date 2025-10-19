using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Models;
using RapidaQuickstart.DotNet.Services;
using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Controllers
{
    /// <summary>
    /// Authentication and authorization endpoints
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IErrorService _errorService;

        public AuthController(IAuthService authService, IUserService userService, IErrorService errorService)
        {
            _authService = authService;
            _userService = userService;
            _errorService = errorService;
        }

        /// <summary>
        /// Login via Google using ID Token
        /// </summary>
        /// <param name="dto">Google login credentials</param>
        /// <returns>JWT access token and user information</returns>
        /// <response code="200">Returns JWT access token after validating Google ID Token</response>
        /// <response code="400">Invalid Google ID Token</response>
        [HttpPost("google/login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            try
            {
                var result = await _authService.GoogleLoginAsync(dto.IdToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("apple/login")]
        public async Task<IActionResult> AppleLogin([FromBody] AppleLoginDto dto)
        {
            try
            {
                var result = await _authService.AppleLoginAsync(dto.IdToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Local login with email and password
        /// </summary>
        /// <param name="dto">Login credentials</param>
        /// <returns>JWT access token and user information</returns>
        /// <response code="200">Returns JWT access token on successful login</response>
        /// <response code="401">Invalid credentials</response>
        /// <response code="400">Invalid request data</response>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Switch active role and receive new JWT token
        /// </summary>
        /// <param name="dto">Role to switch to</param>
        /// <returns>New JWT access token with selected role active</returns>
        /// <response code="200">Returns new JWT access token with selected role active</response>
        /// <response code="401">Unauthorized or user doesn't have the requested role</response>
        /// <response code="400">Invalid request data</response>
        [HttpPost("switch-role")]
        [Authorize]
        public async Task<IActionResult> SwitchRole([FromBody] SwitchRoleDto dto)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = _errorService.GetErrorMessage(ErrorCode.UNAUTHORIZED) });
                }

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = _errorService.GetErrorMessage(ErrorCode.USER_NOT_FOUND) });
                }

                var result = await _authService.SwitchActiveRoleAsync(user, dto.Role);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register-init")]
        public async Task<IActionResult> RegisterInit([FromBody] RegisterInitDto dto)
        {
            try
            {
                var result = await _authService.RegisterInitAsync(dto);
                return Ok(result);
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

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto dto)
        {
            try
            {
                var result = await _authService.SignupAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            try
            {
                var result = await _authService.ForgotPasswordAsync(dto.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
