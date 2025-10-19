using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Interfaces;

namespace RapidaQuickstart.DotNet.Models
{
    [BsonCollection("company-profiles")]
    public class CompanyProfile : IBaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("userId")]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("cnpj")]
        public string? Cnpj { get; set; }

        [BsonElement("companyName")]
        public string CompanyName { get; set; } = string.Empty;

        [BsonElement("businessName")]
        public string BusinessName { get; set; } = string.Empty;

        [BsonElement("birthday")]
        public DateTime? Birthday { get; set; }

        [BsonElement("legalNature")]
        public string? LegalNature { get; set; }

        [BsonElement("companyDescription")]
        public string? CompanyDescription { get; set; }

        [BsonElement("logoImage")]
        public string? LogoImage { get; set; }

        [BsonElement("companyImages")]
        public List<string> CompanyImages { get; set; } = new();

        [BsonElement("tagId")]
        public List<string> TagId { get; set; } = new();

        // Sócios
        [BsonElement("partners")]
        public List<Partner> Partners { get; set; } = new();

        // Contatos
        [BsonElement("contacts")]
        public List<Contact> Contacts { get; set; } = new();

        // Endereço 1
        [BsonElement("addressOneCepBrasilApi")]
        public string? AddressOneCepBrasilApi { get; set; }

        [BsonElement("addressOneType")]
        public string? AddressOneType { get; set; }

        [BsonElement("addressOneStreet")]
        public string? AddressOneStreet { get; set; }

        [BsonElement("addressOneNumber")]
        public string? AddressOneNumber { get; set; }

        [BsonElement("addressOneComplement")]
        public string? AddressOneComplement { get; set; }

        [BsonElement("addressOneCity")]
        public string? AddressOneCity { get; set; }

        [BsonElement("addressOneState")]
        public string? AddressOneState { get; set; }

        // Endereço 2
        [BsonElement("addressTwoCepBrasilApi")]
        public string? AddressTwoCepBrasilApi { get; set; }

        [BsonElement("addressTwoType")]
        public string? AddressTwoType { get; set; }

        [BsonElement("addressTwoStreet")]
        public string? AddressTwoStreet { get; set; }

        [BsonElement("addressTwoNumber")]
        public string? AddressTwoNumber { get; set; }

        [BsonElement("addressTwoComplement")]
        public string? AddressTwoComplement { get; set; }

        [BsonElement("addressTwoCity")]
        public string? AddressTwoCity { get; set; }

        [BsonElement("addressTwoState")]
        public string? AddressTwoState { get; set; }

        // Dados Bancários
        [BsonElement("bankDataOne")]
        public BankData? BankDataOne { get; set; }

        [BsonElement("bankDataTwo")]
        public BankData? BankDataTwo { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isDeleted")]
        public bool IsDeleted { get; set; } = false;

        [BsonElement("deletedAt")]
        public DateTime? DeletedAt { get; set; }
    }

    public class Partner
    {
        [BsonElement("partnerName")]
        public string PartnerName { get; set; } = string.Empty;

        [BsonElement("partnerDocument")]
        public string PartnerDocument { get; set; } = string.Empty;

        [BsonElement("partnerEmail")]
        public string? PartnerEmail { get; set; }

        [BsonElement("partnerPhone")]
        public string? PartnerPhone { get; set; }

        [BsonElement("participationPercentage")]
        public decimal ParticipationPercentage { get; set; }

        [BsonElement("isMainPartner")]
        public bool IsMainPartner { get; set; } = false;
    }

    public class Contact
    {
        [BsonElement("contactType")]
        public string ContactType { get; set; } = string.Empty; // email, phone, whatsapp, etc.

        [BsonElement("contactValue")]
        public string ContactValue { get; set; } = string.Empty;

        [BsonElement("isPrimary")]
        public bool IsPrimary { get; set; } = false;

        [BsonElement("description")]
        public string? Description { get; set; }
    }
}
