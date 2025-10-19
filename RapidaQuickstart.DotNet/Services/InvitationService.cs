using MongoDB.Driver;
using MongoDB.Bson;
using RapidaQuickstart.DotNet.Common.Services;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Models;
using System.Security.Cryptography;
using System.Text;

namespace RapidaQuickstart.DotNet.Services
{
    public interface IInvitationService
    {
        Task<Invitation> CreateInvitationAsync(CreateInvitationDto dto, string invitedBy);
        Task<(List<Invitation> data, int total)> FindAllAsync(InvitationFilterDto filterDto);
        Task<Invitation?> FindInvitationByIdAsync(string id);
        Task<Invitation?> FindInvitationByTokenAsync(string token);
        Task<Invitation?> FindInvitationByEmailAsync(string email);
        Task<Invitation> UpdateInvitationAsync(string id, UpdateInvitationDto dto);
        Task DeleteInvitationAsync(string id);
        Task<Invitation> AcceptInvitationAsync(string token, string acceptedBy);
        Task ResendInvitationAsync(string id, ResendInvitationDto dto);
        Task<bool> IsEmailInvitedAsync(string email);
    }

    public class InvitationService : IInvitationService
    {
        private readonly IMongoCollection<Invitation> _invitations;
        private readonly IEmailService _emailService;

        public InvitationService(IMongoDbService mongoDbService, IEmailService emailService)
        {
            _invitations = mongoDbService.GetCollection<Invitation>("invitations");
            _emailService = emailService;
        }

        public async Task<Invitation> CreateInvitationAsync(CreateInvitationDto dto, string invitedBy)
        {
            // Check if email is already invited
            var existingInvitation = await FindInvitationByEmailAsync(dto.Email);
            if (existingInvitation != null && existingInvitation.IsValid)
            {
                throw new InvalidOperationException("Email already has a pending invitation");
            }

            // Generate invitation token
            var token = GenerateInvitationToken();

            var invitation = new Invitation
            {
                Email = dto.Email,
                InvitationToken = token,
                InvitedBy = invitedBy,
                Role = dto.Role,
                Message = dto.Message,
                ExpiresAt = DateTime.UtcNow.AddDays(dto.ExpirationDays),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _invitations.InsertOneAsync(invitation);

            // Send invitation email
            await SendInvitationEmailAsync(invitation);

            return invitation;
        }

        public async Task<(List<Invitation> data, int total)> FindAllAsync(InvitationFilterDto filterDto)
        {
            var filter = Builders<Invitation>.Filter.Eq(i => i.IsDeleted, false);

            // Apply search filter
            if (!string.IsNullOrEmpty(filterDto.Search))
            {
                var searchFilter = Builders<Invitation>.Filter.Or(
                    Builders<Invitation>.Filter.Regex(i => i.Email, new BsonRegularExpression(filterDto.Search, "i")),
                    Builders<Invitation>.Filter.Regex(i => i.Message, new BsonRegularExpression(filterDto.Search, "i"))
                );
                filter = Builders<Invitation>.Filter.And(filter, searchFilter);
            }

            // Apply role filter
            if (filterDto.Role.HasValue)
            {
                filter = Builders<Invitation>.Filter.And(filter, Builders<Invitation>.Filter.Eq(i => i.Role, filterDto.Role.Value));
            }

            // Apply accepted filter
            if (filterDto.IsAccepted.HasValue)
            {
                filter = Builders<Invitation>.Filter.And(filter, Builders<Invitation>.Filter.Eq(i => i.IsAccepted, filterDto.IsAccepted.Value));
            }

            // Apply expired filter
            if (filterDto.IsExpired.HasValue)
            {
                var now = DateTime.UtcNow;
                if (filterDto.IsExpired.Value)
                {
                    filter = Builders<Invitation>.Filter.And(filter, Builders<Invitation>.Filter.Lt(i => i.ExpiresAt, now));
                }
                else
                {
                    filter = Builders<Invitation>.Filter.And(filter, Builders<Invitation>.Filter.Gte(i => i.ExpiresAt, now));
                }
            }

            // Apply invited by filter
            if (!string.IsNullOrEmpty(filterDto.InvitedBy))
            {
                filter = Builders<Invitation>.Filter.And(filter, Builders<Invitation>.Filter.Eq(i => i.InvitedBy, filterDto.InvitedBy));
            }

            // Build sort
            var sort = filterDto.SortDirection == "desc" 
                ? Builders<Invitation>.Sort.Descending(filterDto.SortBy)
                : Builders<Invitation>.Sort.Ascending(filterDto.SortBy);

            // Get total count
            var total = await _invitations.CountDocumentsAsync(filter);

            // Get paginated data
            var skip = (filterDto.Page - 1) * filterDto.Limit;
            var data = await _invitations.Find(filter)
                .Sort(sort)
                .Skip(skip)
                .Limit(filterDto.Limit)
                .ToListAsync();

            return (data, (int)total);
        }

        public async Task<Invitation?> FindInvitationByIdAsync(string id)
        {
            return await _invitations.Find(i => i.Id == id && !i.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<Invitation?> FindInvitationByTokenAsync(string token)
        {
            return await _invitations.Find(i => i.InvitationToken == token && !i.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<Invitation?> FindInvitationByEmailAsync(string email)
        {
            return await _invitations.Find(i => i.Email == email && !i.IsDeleted).FirstOrDefaultAsync();
        }

        public async Task<Invitation> UpdateInvitationAsync(string id, UpdateInvitationDto dto)
        {
            var existingInvitation = await FindInvitationByIdAsync(id);
            if (existingInvitation == null)
            {
                throw new InvalidOperationException("Invitation not found");
            }

            var update = Builders<Invitation>.Update
                .Set(i => i.Message, dto.Message)
                .Set(i => i.UpdatedAt, DateTime.UtcNow);

            await _invitations.UpdateOneAsync(i => i.Id == id, update);

            return await FindInvitationByIdAsync(id) ?? throw new InvalidOperationException("Invitation not found after update");
        }

        public async Task DeleteInvitationAsync(string id)
        {
            var invitation = await FindInvitationByIdAsync(id);
            if (invitation == null)
            {
                throw new InvalidOperationException("Invitation not found");
            }

            var update = Builders<Invitation>.Update
                .Set(i => i.IsDeleted, true)
                .Set(i => i.DeletedAt, DateTime.UtcNow)
                .Set(i => i.UpdatedAt, DateTime.UtcNow);

            await _invitations.UpdateOneAsync(i => i.Id == id, update);
        }

        public async Task<Invitation> AcceptInvitationAsync(string token, string acceptedBy)
        {
            var invitation = await FindInvitationByTokenAsync(token);
            if (invitation == null)
            {
                throw new InvalidOperationException("Invitation not found");
            }

            if (!invitation.IsValid)
            {
                throw new InvalidOperationException("Invitation is not valid");
            }

            var update = Builders<Invitation>.Update
                .Set(i => i.IsAccepted, true)
                .Set(i => i.AcceptedAt, DateTime.UtcNow)
                .Set(i => i.AcceptedBy, acceptedBy)
                .Set(i => i.UpdatedAt, DateTime.UtcNow);

            await _invitations.UpdateOneAsync(i => i.Id == invitation.Id, update);

            return await FindInvitationByIdAsync(invitation.Id) ?? throw new InvalidOperationException("Invitation not found after acceptance");
        }

        public async Task ResendInvitationAsync(string id, ResendInvitationDto dto)
        {
            var invitation = await FindInvitationByIdAsync(id);
            if (invitation == null)
            {
                throw new InvalidOperationException("Invitation not found");
            }

            if (invitation.IsAccepted)
            {
                throw new InvalidOperationException("Cannot resend accepted invitation");
            }

            // Update message if provided
            if (!string.IsNullOrEmpty(dto.Message))
            {
                var update = Builders<Invitation>.Update
                    .Set(i => i.Message, dto.Message)
                    .Set(i => i.UpdatedAt, DateTime.UtcNow);

                await _invitations.UpdateOneAsync(i => i.Id == id, update);
            }

            // Resend email
            await SendInvitationEmailAsync(invitation);
        }

        public async Task<bool> IsEmailInvitedAsync(string email)
        {
            var invitation = await FindInvitationByEmailAsync(email);
            return invitation != null && invitation.IsValid;
        }

        private string GenerateInvitationToken()
        {
            var bytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }
            return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }

        private async Task SendInvitationEmailAsync(Invitation invitation)
        {
            var subject = "You're invited to join our platform!";
            var message = $@"
                <h2>You're invited!</h2>
                <p>You have been invited to join our platform with the role: <strong>{invitation.Role}</strong></p>
                <p>To accept this invitation, please click the link below:</p>
                <p><a href=""https://your-app.com/accept-invitation?token={invitation.InvitationToken}"">Accept Invitation</a></p>
                <p>This invitation will expire on: {invitation.ExpiresAt:yyyy-MM-dd HH:mm:ss} UTC</p>
                {(string.IsNullOrEmpty(invitation.Message) ? "" : $"<p><strong>Message:</strong> {invitation.Message}</p>")}
                <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            ";

            await _emailService.SendEmailAsync(invitation.Email, subject, message);
        }
    }

    public class UpdateInvitationDto
    {
        public string? Message { get; set; }
    }
}
