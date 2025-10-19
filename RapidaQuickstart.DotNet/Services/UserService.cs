using MongoDB.Driver;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Models;
using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Services
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(CreateUserDto dto);
        Task<User> CreateUserByInvitationAsync(CreateUserByInvitationDto dto);
        Task<List<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByEmailAndPasswordAsync(string email, string password);
        Task<User?> GetUserByRegisterTokenAsync(string token);
        Task<User?> GetUserByPasswordResetTokenAsync(string token);
        Task<bool> UserHasProfileAsync(string userId);
        Task<User> UpdateUserAsync(string id, UpdateUserDto dto);
        Task UpdatePasswordAsync(string userId, string oldPassword, string newPassword);
        Task SoftDeleteUserAsync(string id);
        Task RestoreUserAsync(string id);
        Task<bool> EmailExistsAsync(string email);
    }

    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly IInvitationService _invitationService;
        private readonly IPersonProfileService _personProfileService;
        private readonly ICompanyProfileService _companyProfileService;

        public UserService(IMongoDbService mongoDbService, IEmailService emailService, IJwtService jwtService, IInvitationService invitationService, IPersonProfileService personProfileService, ICompanyProfileService companyProfileService)
        {
            _users = mongoDbService.GetCollection<User>("users");
            _emailService = emailService;
            _jwtService = jwtService;
            _invitationService = invitationService;
            _personProfileService = personProfileService;
            _companyProfileService = companyProfileService;
        }

        public async Task<User> CreateUserAsync(CreateUserDto dto)
        {
            if (await EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = new User
            {
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Roles = new List<UserRole> { UserRole.PERSON },
                ActiveRole = UserRole.PERSON,
                Provider = Provider.LOCAL,
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<User> CreateUserByInvitationAsync(CreateUserByInvitationDto dto)
        {
            // Find invitation by token
            var invitation = await _invitationService.FindInvitationByTokenAsync(dto.InvitationToken);
            if (invitation == null || invitation.IsExpired || invitation.IsAccepted)
            {
                throw new InvalidOperationException("Invalid or expired invitation");
            }

            // Check if email matches invitation
            if (invitation.Email != dto.Email)
            {
                throw new InvalidOperationException("Email does not match invitation");
            }

            // Check if user already exists
            if (await EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            var user = new User
            {
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Roles = new List<UserRole> { invitation.Role },
                ActiveRole = invitation.Role,
                Provider = Provider.LOCAL,
                IsEmailVerified = true, // Invited users are considered verified
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _users.InsertOneAsync(user);

            // Mark invitation as accepted
            await _invitationService.AcceptInvitationAsync(dto.InvitationToken, user.Id);

            return user;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _users.Find(u => !u.IsDeleted).ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _users.Find(u => u.Id == id && !u.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email && !u.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAndPasswordAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null;
            }
            return user;
        }

        public async Task<User?> GetUserByRegisterTokenAsync(string token)
        {
            return await _users.Find(u => u.RegisterToken == token && u.RegisterTokenExpires > DateTime.UtcNow && !u.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByPasswordResetTokenAsync(string token)
        {
            return await _users.Find(u => u.PasswordResetToken == token && u.PasswordResetExpires > DateTime.UtcNow && !u.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<bool> UserHasProfileAsync(string userId)
        {
            // Check if user has a person profile
            var personProfile = await _personProfileService.FindProfileByUserIdAsync(userId);
            if (personProfile != null) return true;

            // Check if user has a company profile
            var companyProfile = await _companyProfileService.FindProfileByUserIdAsync(userId);
            if (companyProfile != null) return true;

            return false;
        }

        public async Task<User> UpdateUserAsync(string id, UpdateUserDto dto)
        {
            var update = Builders<User>.Update
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            if (!string.IsNullOrEmpty(dto.Email))
            {
                update = update.Set(u => u.Email, dto.Email);
            }

            if (dto.IsEmailVerified.HasValue)
            {
                update = update.Set(u => u.IsEmailVerified, dto.IsEmailVerified.Value);
            }

            if (dto.ActiveRole.HasValue)
            {
                update = update.Set(u => u.ActiveRole, dto.ActiveRole.Value);
            }

            if (!string.IsNullOrEmpty(dto.PasswordResetToken))
            {
                update = update.Set(u => u.PasswordResetToken, dto.PasswordResetToken);
            }

            if (dto.PasswordResetExpires.HasValue)
            {
                update = update.Set(u => u.PasswordResetExpires, dto.PasswordResetExpires.Value);
            }

            await _users.UpdateOneAsync(u => u.Id == id, update);
            return await GetUserByIdAsync(id) ?? throw new InvalidOperationException("User not found");
        }

        public async Task UpdatePasswordAsync(string userId, string oldPassword, string newPassword)
        {
            var user = await GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            if (!BCrypt.Net.BCrypt.Verify(oldPassword, user.Password))
            {
                throw new InvalidOperationException("Current password is incorrect");
            }

            var update = Builders<User>.Update
                .Set(u => u.Password, BCrypt.Net.BCrypt.HashPassword(newPassword))
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            await _users.UpdateOneAsync(u => u.Id == userId, update);
        }

        public async Task SoftDeleteUserAsync(string id)
        {
            var update = Builders<User>.Update
                .Set(u => u.IsDeleted, true)
                .Set(u => u.DeletedAt, DateTime.UtcNow)
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            await _users.UpdateOneAsync(u => u.Id == id, update);
        }

        public async Task RestoreUserAsync(string id)
        {
            var update = Builders<User>.Update
                .Set(u => u.IsDeleted, false)
                .Unset(u => u.DeletedAt)
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            await _users.UpdateOneAsync(u => u.Id == id, update);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            var user = await _users.Find(u => u.Email == email && !u.IsDeleted).FirstOrDefaultAsync();
            return user != null;
        }
    }
}
