using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RapidaQuickstart.DotNet.Enums;
using RapidaQuickstart.DotNet.Interfaces;

namespace RapidaQuickstart.DotNet.Models
{
    [BsonCollection("person-profiles")]
    public class PersonProfile : IBaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("userId")]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("personName")]
        public string PersonName { get; set; } = string.Empty;

        [BsonElement("personNickname")]
        public string? PersonNickname { get; set; }

        [BsonElement("gender")]
        public Gender Gender { get; set; }

        [BsonElement("birthday")]
        public DateTime Birthday { get; set; }

        [BsonElement("maritalStatus")]
        public MaritalStatus? MaritalStatus { get; set; }

        [BsonElement("motherName")]
        public string? MotherName { get; set; }

        [BsonElement("fatherName")]
        public string? FatherName { get; set; }

        [BsonElement("tagId")]
        public List<string> TagId { get; set; } = new();

        [BsonElement("personDescription")]
        public string? PersonDescription { get; set; }

        // Documentos
        [BsonElement("cpf")]
        public string? Cpf { get; set; }

        [BsonElement("cpfFile")]
        public string? CpfFile { get; set; }

        [BsonElement("rg")]
        public string? Rg { get; set; }

        [BsonElement("rgIssuingAuthority")]
        public string? RgIssuingAuthority { get; set; }

        [BsonElement("rgIssuanceDate")]
        public DateTime? RgIssuanceDate { get; set; }

        [BsonElement("rgState")]
        public string? RgState { get; set; }

        [BsonElement("rgFile")]
        public string? RgFile { get; set; }

        [BsonElement("passport")]
        public string? Passport { get; set; }

        [BsonElement("passportIssuanceDate")]
        public DateTime? PassportIssuanceDate { get; set; }

        [BsonElement("passportExpirationDate")]
        public DateTime? PassportExpirationDate { get; set; }

        [BsonElement("passportFile")]
        public string? PassportFile { get; set; }

        // Contatos
        [BsonElement("phoneNumberOne")]
        public string? PhoneNumberOne { get; set; }

        [BsonElement("phoneNumberTwo")]
        public string? PhoneNumberTwo { get; set; }

        [BsonElement("emailOne")]
        public string? EmailOne { get; set; }

        [BsonElement("emailTwo")]
        public string? EmailTwo { get; set; }

        [BsonElement("linkedin")]
        public string? Linkedin { get; set; }

        [BsonElement("instagram")]
        public string? Instagram { get; set; }

        [BsonElement("facebook")]
        public string? Facebook { get; set; }

        [BsonElement("x")]
        public string? X { get; set; }

        // Endereços
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

        // Experiência Profissional
        [BsonElement("personJobs")]
        public List<PersonJob> PersonJobs { get; set; } = new();

        // Educação
        [BsonElement("personEducations")]
        public List<PersonEducation> PersonEducations { get; set; } = new();

        // Cursos
        [BsonElement("personCourses")]
        public List<PersonCourse> PersonCourses { get; set; } = new();

        // Idiomas
        [BsonElement("personLanguages")]
        public List<string> PersonLanguages { get; set; } = new();

        // Dados Bancários
        [BsonElement("bankDataOne")]
        public BankData? BankDataOne { get; set; }

        [BsonElement("bankDataTwo")]
        public BankData? BankDataTwo { get; set; }

        // Arquivos Relacionados
        [BsonElement("relatedFiles")]
        public List<RelatedFile> RelatedFiles { get; set; } = new();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isDeleted")]
        public bool IsDeleted { get; set; } = false;

        [BsonElement("deletedAt")]
        public DateTime? DeletedAt { get; set; }
    }

    public class PersonJob
    {
        [BsonElement("companyName")]
        public string CompanyName { get; set; } = string.Empty;

        [BsonElement("position")]
        public string Position { get; set; } = string.Empty;

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("endDate")]
        public DateTime? EndDate { get; set; }

        [BsonElement("isCurrentJob")]
        public bool IsCurrentJob { get; set; } = false;

        [BsonElement("description")]
        public string? Description { get; set; }
    }

    public class PersonEducation
    {
        [BsonElement("institutionName")]
        public string InstitutionName { get; set; } = string.Empty;

        [BsonElement("courseName")]
        public string CourseName { get; set; } = string.Empty;

        [BsonElement("educationLevel")]
        public EducationLevel EducationLevel { get; set; }

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("endDate")]
        public DateTime? EndDate { get; set; }

        [BsonElement("isCompleted")]
        public bool IsCompleted { get; set; } = false;

        [BsonElement("description")]
        public string? Description { get; set; }
    }

    public class PersonCourse
    {
        [BsonElement("courseName")]
        public string CourseName { get; set; } = string.Empty;

        [BsonElement("institutionName")]
        public string InstitutionName { get; set; } = string.Empty;

        [BsonElement("startDate")]
        public DateTime StartDate { get; set; }

        [BsonElement("endDate")]
        public DateTime? EndDate { get; set; }

        [BsonElement("isCompleted")]
        public bool IsCompleted { get; set; } = false;

        [BsonElement("description")]
        public string? Description { get; set; }
    }

    public class BankData
    {
        [BsonElement("bankName")]
        public string BankName { get; set; } = string.Empty;

        [BsonElement("bankCode")]
        public string BankCode { get; set; } = string.Empty;

        [BsonElement("agencyNumber")]
        public string AgencyNumber { get; set; } = string.Empty;

        [BsonElement("accountNumber")]
        public string AccountNumber { get; set; } = string.Empty;

        [BsonElement("accountType")]
        public AccountType? AccountType { get; set; }

        [BsonElement("accountHolderName")]
        public string AccountHolderName { get; set; } = string.Empty;

        [BsonElement("accountHolderDocument")]
        public string AccountHolderDocument { get; set; } = string.Empty;
    }

    public class RelatedFile
    {
        [BsonElement("fileName")]
        public string FileName { get; set; } = string.Empty;

        [BsonElement("fileUrl")]
        public string FileUrl { get; set; } = string.Empty;

        [BsonElement("fileType")]
        public string FileType { get; set; } = string.Empty;

        [BsonElement("fileSize")]
        public long FileSize { get; set; }

        [BsonElement("uploadDate")]
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("relatedFilesDateYear")]
        public int RelatedFilesDateYear { get; set; }
    }
}
