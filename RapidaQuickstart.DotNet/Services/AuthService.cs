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
            try
            {
                using var httpClient = new HttpClient();
                var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v1/tokeninfo?id_token={idToken}");
                
                if (!response.IsSuccessStatusCode)
                {
                    throw new UnauthorizedAccessException("Invalid Google ID token");
                }

                var content = await response.Content.ReadAsStringAsync();
                var tokenInfo = System.Text.Json.JsonSerializer.Deserialize<GoogleTokenInfo>(content);

                if (string.IsNullOrEmpty(tokenInfo?.Email) || string.IsNullOrEmpty(tokenInfo.Sub))
                {
                    throw new UnauthorizedAccessException("Invalid Google token data");
                }

                var user = await _userService.GetUserByEmailAsync(tokenInfo.Email);
                if (user == null)
                {
                    // Create new user for Google login
                    var createUserDto = new CreateUserDto
                    {
                        Email = tokenInfo.Email,
                        Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString())
                    };
                    user = await _userService.CreateUserAsync(createUserDto);
                    
                    // Update user with Google provider info
                    await _userService.UpdateUserAsync(user.Id, new UpdateUserDto 
                    { 
                        // Add provider info if needed
                    });
                }

                var token = _jwtService.GenerateToken(user);
                return new { access_token = token, user = new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole } };
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException($"Google login failed: {ex.Message}");
            }
        }

        public async Task<object> AppleLoginAsync(string idToken)
        {
            try
            {
                // Decode JWT header to get kid
                var tokenParts = idToken.Split('.');
                if (tokenParts.Length != 3)
                {
                    throw new UnauthorizedAccessException("Invalid Apple ID token format");
                }

                var headerJson = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(tokenParts[0] + "=="));
                var header = System.Text.Json.JsonSerializer.Deserialize<AppleTokenHeader>(headerJson);

                if (string.IsNullOrEmpty(header?.Kid))
                {
                    throw new UnauthorizedAccessException("Invalid Apple token header");
                }

                // Get Apple public key
                using var httpClient = new HttpClient();
                var keysResponse = await httpClient.GetAsync("https://appleid.apple.com/auth/keys");
                var keysContent = await keysResponse.Content.ReadAsStringAsync();
                var keysData = System.Text.Json.JsonSerializer.Deserialize<AppleKeysResponse>(keysContent);

                var key = keysData?.Keys?.FirstOrDefault(k => k.Kid == header.Kid);
                if (key == null)
                {
                    throw new UnauthorizedAccessException("Apple public key not found");
                }

                // For now, we'll decode the payload without verification
                // In production, you should verify the signature
                var payloadJson = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(tokenParts[1] + "=="));
                var payload = System.Text.Json.JsonSerializer.Deserialize<AppleTokenPayload>(payloadJson);

                if (string.IsNullOrEmpty(payload?.Email) || string.IsNullOrEmpty(payload.Sub))
                {
                    throw new UnauthorizedAccessException("Invalid Apple token payload");
                }

                var user = await _userService.GetUserByEmailAsync(payload.Email);
                if (user == null)
                {
                    // Create new user for Apple login
                    var createUserDto = new CreateUserDto
                    {
                        Email = payload.Email,
                        Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString())
                    };
                    user = await _userService.CreateUserAsync(createUserDto);
                }

                var token = _jwtService.GenerateToken(user);
                return new { access_token = token, user = new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole } };
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException($"Apple login failed: {ex.Message}");
            }
        }

        public async Task<object> SwitchActiveRoleAsync(User user, UserRole role)
        {
            if (!user.Roles.Contains(role))
            {
                throw new UnauthorizedAccessException("User does not have this role");
            }

            // Update user's active role
            user.ActiveRole = role;
            await _userService.UpdateUserAsync(user.Id, new UpdateUserDto { ActiveRole = role });

            // Generate new token with updated role
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

            // Create a temporary user with registration token
            var tempUser = new User
            {
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Temporary password
                Roles = new List<UserRole> { UserRole.PERSON },
                ActiveRole = UserRole.PERSON,
                Provider = Provider.LOCAL,
                IsEmailVerified = false,
                RegisterToken = token,
                RegisterTokenExpires = expiresAt,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userService.CreateUserAsync(new CreateUserDto { Email = dto.Email, Password = tempUser.Password });

            // Send registration email
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
            await _userService.UpdatePasswordAsync(user.Id, user.Password, dto.Password);
            await _userService.UpdateUserAsync(user.Id, new UpdateUserDto { IsEmailVerified = true });

            // Clear registration token
            user.RegisterToken = null;
            user.RegisterTokenExpires = null;
            user.IsEmailVerified = true;

            var token = _jwtService.GenerateToken(user);
            return new { access_token = token, user = new { id = user.Id, email = user.Email, roles = user.Roles, activeRole = user.ActiveRole } };
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
            await _userService.UpdateUserAsync(user.Id, new UpdateUserDto 
            { 
                PasswordResetToken = token,
                PasswordResetExpires = expiresAt
            });

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
            await _userService.UpdateUserAsync(user.Id, new UpdateUserDto 
            { 
                PasswordResetToken = null,
                PasswordResetExpires = null
            });

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

    public class GoogleTokenInfo
    {
        public string? Email { get; set; }
        public string? Sub { get; set; }
        public string? Picture { get; set; }
    }

    public class AppleTokenHeader
    {
        public string? Kid { get; set; }
        public string? Alg { get; set; }
    }

    public class AppleTokenPayload
    {
        public string? Email { get; set; }
        public string? Sub { get; set; }
        public string? Iss { get; set; }
        public string? Aud { get; set; }
        public long? Exp { get; set; }
        public long? Iat { get; set; }
    }

    public class AppleKeysResponse
    {
        public List<AppleKey>? Keys { get; set; }
    }

    public class AppleKey
    {
        public string? Kid { get; set; }
        public string? Kty { get; set; }
        public string? Use { get; set; }
        public string? N { get; set; }
        public string? E { get; set; }
    }
}
