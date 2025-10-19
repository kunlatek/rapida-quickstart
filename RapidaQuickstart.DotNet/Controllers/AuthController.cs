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
    [ApiController]
    [Route("api/[controller]")]
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
