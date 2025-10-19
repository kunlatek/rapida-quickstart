using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class CreateCompanyProfileDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [StringLength(18)]
        public string? Cnpj { get; set; }

        [Required]
        [StringLength(200)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string BusinessName { get; set; } = string.Empty;

        public DateTime? Birthday { get; set; }

        [StringLength(100)]
        public string? LegalNature { get; set; }

        [StringLength(1000)]
        public string? CompanyDescription { get; set; }

        public string? LogoImage { get; set; }

        public List<string>? CompanyImages { get; set; }

        [Required]
        public List<string> TagId { get; set; } = new();

        // Sócios
        public List<PartnerDto>? Partners { get; set; }

        // Contatos
        public List<ContactDto>? Contacts { get; set; }

        // Endereço 1
        [StringLength(9)]
        public string? AddressOneCepBrasilApi { get; set; }

        public string? AddressOneType { get; set; }

        [StringLength(200)]
        public string? AddressOneStreet { get; set; }

        [StringLength(20)]
        public string? AddressOneNumber { get; set; }

        [StringLength(100)]
        public string? AddressOneComplement { get; set; }

        [StringLength(100)]
        public string? AddressOneCity { get; set; }

        [StringLength(2)]
        public string? AddressOneState { get; set; }

        // Endereço 2
        [StringLength(9)]
        public string? AddressTwoCepBrasilApi { get; set; }

        public string? AddressTwoType { get; set; }

        [StringLength(200)]
        public string? AddressTwoStreet { get; set; }

        [StringLength(20)]
        public string? AddressTwoNumber { get; set; }

        [StringLength(100)]
        public string? AddressTwoComplement { get; set; }

        [StringLength(100)]
        public string? AddressTwoCity { get; set; }

        [StringLength(2)]
        public string? AddressTwoState { get; set; }

        // Dados Bancários
        public BankDataDto? BankDataOne { get; set; }

        public BankDataDto? BankDataTwo { get; set; }
    }

    public class UpdateCompanyProfileDto : CreateCompanyProfileDto
    {
        // Herda todos os campos do CreateCompanyProfileDto
    }

    public class CompanyProfileFilterDto
    {
        public string? Search { get; set; }
        public string? LegalNature { get; set; }
        public List<string>? TagIds { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string? SortBy { get; set; } = "createdAt";
        public string? SortDirection { get; set; } = "desc";
    }

    public class PartnerDto
    {
        [Required]
        [StringLength(100)]
        public string PartnerName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string PartnerDocument { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(100)]
        public string? PartnerEmail { get; set; }

        [StringLength(20)]
        public string? PartnerPhone { get; set; }

        [Range(0, 100)]
        public decimal ParticipationPercentage { get; set; }

        public bool IsMainPartner { get; set; } = false;
    }

    public class ContactDto
    {
        [Required]
        [StringLength(50)]
        public string ContactType { get; set; } = string.Empty; // email, phone, whatsapp, etc.

        [Required]
        [StringLength(100)]
        public string ContactValue { get; set; } = string.Empty;

        public bool IsPrimary { get; set; } = false;

        [StringLength(200)]
        public string? Description { get; set; }
    }
}
