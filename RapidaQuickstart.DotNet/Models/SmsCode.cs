using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RapidaQuickstart.DotNet.Interfaces;

namespace RapidaQuickstart.DotNet.Models
{
    [BsonCollection("sms-codes")]
    public class SmsCode : IBaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("phoneNumber")]
        public string PhoneNumber { get; set; } = string.Empty;

        [BsonElement("code")]
        public string Code { get; set; } = string.Empty;

        [BsonElement("isVerified")]
        public bool IsVerified { get; set; } = false;

        [BsonElement("verifiedAt")]
        public DateTime? VerifiedAt { get; set; }

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("attempts")]
        public int Attempts { get; set; } = 0;

        [BsonElement("maxAttempts")]
        public int MaxAttempts { get; set; } = 3;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isDeleted")]
        public bool IsDeleted { get; set; } = false;

        [BsonElement("deletedAt")]
        public DateTime? DeletedAt { get; set; }

        public bool IsExpired => DateTime.UtcNow > ExpiresAt;
        public bool IsValid => !IsVerified && !IsExpired && Attempts < MaxAttempts && !IsDeleted;
    }
}
