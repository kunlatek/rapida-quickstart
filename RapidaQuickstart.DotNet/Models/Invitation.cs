using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Interfaces;

namespace RapidaQuickstart.DotNet.Models
{
    [BsonCollection("invitations")]
    public class Invitation : IBaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("invitationToken")]
        public string InvitationToken { get; set; } = string.Empty;

        [BsonElement("invitedBy")]
        public string InvitedBy { get; set; } = string.Empty;

        [BsonElement("role")]
        public UserRole Role { get; set; }

        [BsonElement("isAccepted")]
        public bool IsAccepted { get; set; } = false;

        [BsonElement("acceptedAt")]
        public DateTime? AcceptedAt { get; set; }

        [BsonElement("acceptedBy")]
        public string? AcceptedBy { get; set; }

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("message")]
        public string? Message { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isDeleted")]
        public bool IsDeleted { get; set; } = false;

        [BsonElement("deletedAt")]
        public DateTime? DeletedAt { get; set; }

        public bool IsExpired => DateTime.UtcNow > ExpiresAt;
        public bool IsValid => !IsAccepted && !IsExpired && !IsDeleted;
    }
}
