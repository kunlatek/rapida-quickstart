using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
