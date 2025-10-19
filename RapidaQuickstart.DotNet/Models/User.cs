using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Interfaces;
using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Models
{
    [BsonCollection("users")]
    public class User : IBaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("roles")]
        public List<UserRole> Roles { get; set; } = new();

        [BsonElement("activeRole")]
        public UserRole ActiveRole { get; set; } = UserRole.PERSON;

        [BsonElement("provider")]
        public Provider Provider { get; set; } = Provider.LOCAL;

        [BsonElement("providerId")]
        public string? ProviderId { get; set; }

        [BsonElement("isEmailVerified")]
        public bool IsEmailVerified { get; set; } = false;

        [BsonElement("emailVerificationToken")]
        public string? EmailVerificationToken { get; set; }

        [BsonElement("passwordResetToken")]
        public string? PasswordResetToken { get; set; }

        [BsonElement("passwordResetExpires")]
        public DateTime? PasswordResetExpires { get; set; }

        [BsonElement("registerToken")]
        public string? RegisterToken { get; set; }

        [BsonElement("registerTokenExpires")]
        public DateTime? RegisterTokenExpires { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isDeleted")]
        public bool IsDeleted { get; set; } = false;

        [BsonElement("deletedAt")]
        public DateTime? DeletedAt { get; set; }

        public ClaimsPrincipal ToClaimsPrincipal()
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, Id),
                new(ClaimTypes.Email, Email),
                new("userId", Id),
                new("activeRole", ActiveRole.ToString())
            };

            foreach (var role in Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }

            var identity = new ClaimsIdentity(claims, "jwt");
            return new ClaimsPrincipal(identity);
        }
    }
}
