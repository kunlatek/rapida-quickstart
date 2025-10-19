using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
