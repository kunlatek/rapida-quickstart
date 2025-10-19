using System.ComponentModel.DataAnnotations;
using RapidaQuickstart.DotNet.Enums;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class CreateInvitationDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }

        [StringLength(500)]
        public string? Message { get; set; }

        [Range(1, 30)]
        public int ExpirationDays { get; set; } = 7;
    }

    public class InvitationResponseDto
    {
        [Required]
        public string InvitationToken { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }

    public class InvitationFilterDto
    {
        public string? Search { get; set; }
        public UserRole? Role { get; set; }
        public bool? IsAccepted { get; set; }
        public bool? IsExpired { get; set; }
        public string? InvitedBy { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string? SortBy { get; set; } = "createdAt";
        public string? SortDirection { get; set; } = "desc";
    }

    public class ResendInvitationDto
    {
        [Required]
        public string InvitationId { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Message { get; set; }
    }
}
