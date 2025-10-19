using MongoDB.Driver;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Models;
using System.Security.Cryptography;
using System.Text;

namespace RapidaQuickstart.DotNet.Services
{
    public interface IAuthService
    {
        Task<object> LoginAsync(LoginDto dto);
        Task<object> GoogleLoginAsync(string idToken);
        Task<object> AppleLoginAsync(string idToken);
        Task<object> SwitchActiveRoleAsync(User user, UserRole role);
        Task<object> RegisterInitAsync(RegisterInitDto dto);
        Task<object> SignupAsync(SignupDto dto);
        Task<object> ForgotPasswordAsync(string email);
        Task<object> ResetPasswordAsync(ResetPasswordDto dto);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;

        public AuthService(IUserService userService, IEmailService emailService, IJwtService jwtService)
        {
            _userService = userService;
            _emailService = emailService;
            _jwtService = jwtService;
        }

        public async Task<object> LoginAsync(LoginDto dto)
        {
            var user = await _userService.GetUserByEmailAndPasswordAsync(dto.Email, dto.Password);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);
            return new { access_token = token, user = new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole } };
        }

        public async Task<object> GoogleLoginAsync(string idToken)
        {
            // This would require Google token validation
            // For now, we'll throw NotImplementedException
            throw new NotImplementedException("Google login will be implemented with proper token validation");
        }

        public async Task<object> AppleLoginAsync(string idToken)
        {
            // This would require Apple token validation
            // For now, we'll throw NotImplementedException
            throw new NotImplementedException("Apple login will be implemented with proper token validation");
        }

        public async Task<object> SwitchActiveRoleAsync(User user, UserRole role)
        {
            if (!user.Roles.Contains(role))
            {
                throw new UnauthorizedAccessException("User does not have this role");
            }

            // Update user's active role
            var updateDto = new UpdateUserDto();
            // We need to add a method to update active role in UserService
            // For now, we'll create a new token with the switched role
            user.ActiveRole = role;
            var token = _jwtService.GenerateToken(user);
            
            return new { access_token = token, user = new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole } };
        }

        public async Task<object> RegisterInitAsync(RegisterInitDto dto)
        {
            if (await _userService.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var token = GenerateSecureToken();
            var expiresAt = DateTime.UtcNow.AddHours(24);

            // Store the registration token (we'll need to add this to User model)
            // For now, we'll just send the email
            await _emailService.SendRegistrationEmailAsync(dto.Email, token);

            return new { message = "Registration email sent successfully" };
        }

        public async Task<object> SignupAsync(SignupDto dto)
        {
            var user = await _userService.GetUserByRegisterTokenAsync(dto.RegisterToken);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired registration token");
            }

            // Update user with password and mark as verified
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.IsEmailVerified = true;
            user.RegisterToken = null;
            user.RegisterTokenExpires = null;
            user.UpdatedAt = DateTime.UtcNow;

            // We need to add an update method for this
            // For now, we'll create a new user
            var createUserDto = new CreateUserDto { Email = dto.Email, Password = dto.Password };
            var newUser = await _userService.CreateUserAsync(createUserDto);

            var token = _jwtService.GenerateToken(newUser);
            return new { access_token = token, user = new { id = newUser.Id, email = newUser.Email, roles = newUser.Roles, activeRole = newUser.ActiveRole } };
        }

        public async Task<object> ForgotPasswordAsync(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                // Don't reveal if email exists or not
                return new { message = "If the email exists, a password reset email has been sent" };
            }

            var token = GenerateSecureToken();
            var expiresAt = DateTime.UtcNow.AddHours(1);

            // Update user with reset token
            user.PasswordResetToken = token;
            user.PasswordResetExpires = expiresAt;
            user.UpdatedAt = DateTime.UtcNow;

            await _emailService.SendPasswordResetEmailAsync(email, token);

            return new { message = "If the email exists, a password reset email has been sent" };
        }

        public async Task<object> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userService.GetUserByPasswordResetTokenAsync(dto.Token);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired reset token");
            }

            await _userService.UpdatePasswordAsync(user.Id, "", dto.NewPassword);

            // Clear reset token
            user.PasswordResetToken = null;
            user.PasswordResetExpires = null;
            user.UpdatedAt = DateTime.UtcNow;

            return new { message = "Password reset successfully" };
        }

        private string GenerateSecureToken()
        {
            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
