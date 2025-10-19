using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class CreateSmsCodeDto
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [Range(1, 10)]
        public int ExpirationMinutes { get; set; } = 5;
    }

    public class VerifySmsCodeDto
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(6, MinimumLength = 4)]
        public string Code { get; set; } = string.Empty;
    }

    public class SmsCodeFilterDto
    {
        public string? PhoneNumber { get; set; }
        public bool? IsVerified { get; set; }
        public bool? IsExpired { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string? SortBy { get; set; } = "createdAt";
        public string? SortDirection { get; set; } = "desc";
    }
}
