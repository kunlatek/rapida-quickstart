using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class CreateUserByInvitationDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string InvitationToken { get; set; } = string.Empty;
    }
}
