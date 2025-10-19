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

        public UserService(IMongoDbService mongoDbService, IEmailService emailService, IJwtService jwtService)
        {
            _users = mongoDbService.GetCollection<User>("users");
            _emailService = emailService;
            _jwtService = jwtService;
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
            // This will be implemented when we create the invitation service
            throw new NotImplementedException("Will be implemented with invitation service");
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
            // This will be implemented when we create the profile services
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
