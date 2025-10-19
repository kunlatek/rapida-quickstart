using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Services;

namespace RapidaQuickstart.DotNet.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IErrorService _errorService;

        public UsersController(IUserService userService, IErrorService errorService)
        {
            _userService = userService;
            _errorService = errorService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(dto);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, new { message = "User created successfully", userId = user.Id });
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

        [HttpPost("invitation")]
        public async Task<IActionResult> CreateUserByInvitation([FromBody] CreateUserByInvitationDto dto)
        {
            try
            {
                var user = await _userService.CreateUserByInvitationAsync(dto);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, new { message = "User created successfully", userId = user.Id });
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

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
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

                return Ok(new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole, isEmailVerified = user.IsEmailVerified });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("has-profile")]
        [Authorize]
        public async Task<IActionResult> UserHasProfile()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = _errorService.GetErrorMessage(ErrorCode.UNAUTHORIZED) });
                }

                var hasProfile = await _userService.UserHasProfileAsync(userId);
                return Ok(new { hasProfile });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = _errorService.GetErrorMessage(ErrorCode.USER_NOT_FOUND) });
                }

                return Ok(new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole, isEmailVerified = user.IsEmailVerified });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("restore")]
        [Authorize(Roles = "PERSON,COMPANY")]
        public async Task<IActionResult> RestoreOwnProfile()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = _errorService.GetErrorMessage(ErrorCode.UNAUTHORIZED) });
                }

                await _userService.RestoreUserAsync(userId);
                return Ok(new { message = "User restored successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("change-password")]
        [Authorize(Roles = "PERSON,COMPANY")]
        public async Task<IActionResult> ChangePassword([FromBody] UpdatePasswordDto dto)
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = _errorService.GetErrorMessage(ErrorCode.UNAUTHORIZED) });
                }

                await _userService.UpdatePasswordAsync(userId, dto.OldPassword, dto.NewPassword);
                return Ok(new { message = "Password changed successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, dto);
                return Ok(new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole, isEmailVerified = user.IsEmailVerified });
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> SoftDeleteUser(string id)
        {
            try
            {
                await _userService.SoftDeleteUserAsync(id);
                return Ok(new { message = "User soft deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete]
        [Authorize(Roles = "PERSON,COMPANY")]
        public async Task<IActionResult> SoftDeleteOwnProfile()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = _errorService.GetErrorMessage(ErrorCode.UNAUTHORIZED) });
                }

                await _userService.SoftDeleteUserAsync(userId);
                return Ok(new { message = "User soft deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
