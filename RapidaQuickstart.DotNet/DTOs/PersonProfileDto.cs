using System.ComponentModel.DataAnnotations;
using RapidaQuickstart.DotNet.Enums;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class CreatePersonProfileDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string PersonName { get; set; } = string.Empty;

        [StringLength(50)]
        public string? PersonNickname { get; set; }

        [Required]
        public Gender Gender { get; set; }

        [Required]
        public DateTime Birthday { get; set; }

        public MaritalStatus? MaritalStatus { get; set; }

        [StringLength(100)]
        public string? MotherName { get; set; }

        [StringLength(100)]
        public string? FatherName { get; set; }

        [Required]
        public List<string> TagId { get; set; } = new();

        [StringLength(1000)]
        public string? PersonDescription { get; set; }

        // Documentos
        [StringLength(14)]
        public string? Cpf { get; set; }

        public string? CpfFile { get; set; }

        [StringLength(20)]
        public string? Rg { get; set; }

        [StringLength(50)]
        public string? RgIssuingAuthority { get; set; }

        public DateTime? RgIssuanceDate { get; set; }

        [StringLength(2)]
        public string? RgState { get; set; }

        public string? RgFile { get; set; }

        [StringLength(20)]
        public string? Passport { get; set; }

        public DateTime? PassportIssuanceDate { get; set; }

        public DateTime? PassportExpirationDate { get; set; }

        public string? PassportFile { get; set; }

        // Contatos
        [StringLength(20)]
        public string? PhoneNumberOne { get; set; }

        [StringLength(20)]
        public string? PhoneNumberTwo { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? EmailOne { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? EmailTwo { get; set; }

        [StringLength(100)]
        public string? Linkedin { get; set; }

        [StringLength(100)]
        public string? Instagram { get; set; }

        [StringLength(100)]
        public string? Facebook { get; set; }

        [StringLength(100)]
        public string? X { get; set; }

        // Endereços
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

        // Experiência Profissional
        public List<PersonJobDto>? PersonJobs { get; set; }

        // Educação
        public List<PersonEducationDto>? PersonEducations { get; set; }

        // Cursos
        public List<PersonCourseDto>? PersonCourses { get; set; }

        // Idiomas
        public List<string>? PersonLanguages { get; set; }

        // Dados Bancários
        public BankDataDto? BankDataOne { get; set; }

        public BankDataDto? BankDataTwo { get; set; }

        // Arquivos Relacionados
        public List<RelatedFileDto>? RelatedFiles { get; set; }
    }

    public class UpdatePersonProfileDto : CreatePersonProfileDto
    {
        // Herda todos os campos do CreatePersonProfileDto
    }

    public class PersonProfileFilterDto
    {
        public string? Search { get; set; }
        public Gender? Gender { get; set; }
        public MaritalStatus? MaritalStatus { get; set; }
        public List<string>? TagIds { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string? SortBy { get; set; } = "createdAt";
        public string? SortDirection { get; set; } = "desc";
    }

    public class PersonJobDto
    {
        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Position { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCurrentJob { get; set; } = false;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class PersonEducationDto
    {
        [Required]
        [StringLength(100)]
        public string InstitutionName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string CourseName { get; set; } = string.Empty;

        [Required]
        public EducationLevel EducationLevel { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class PersonCourseDto
    {
        [Required]
        [StringLength(100)]
        public string CourseName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string InstitutionName { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class BankDataDto
    {
        [Required]
        [StringLength(100)]
        public string BankName { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string BankCode { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string AgencyNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string AccountNumber { get; set; } = string.Empty;

        public AccountType? AccountType { get; set; }

        [Required]
        [StringLength(100)]
        public string AccountHolderName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string AccountHolderDocument { get; set; } = string.Empty;
    }

    public class RelatedFileDto
    {
        [Required]
        [StringLength(200)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string FileUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string FileType { get; set; } = string.Empty;

        [Required]
        public long FileSize { get; set; }

        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public int RelatedFilesDateYear { get; set; }
    }
}
