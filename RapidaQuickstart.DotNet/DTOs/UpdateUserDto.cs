using System.ComponentModel.DataAnnotations;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class UpdateUserDto
    {
        [EmailAddress]
        public string? Email { get; set; }

        public bool? IsEmailVerified { get; set; }
    }
}
