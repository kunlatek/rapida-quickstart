using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class AppleLoginDto
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;
    }
}
