using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class SignupDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string RegisterToken { get; set; } = string.Empty;
    }
}
