using System.ComponentModel.DataAnnotations;
using RapidaQuickstart.DotNet.Enums;

namespace RapidaQuickstart.DotNet.DTOs
{
    public class UpdateUserDto
    {
        [EmailAddress]
        public string? Email { get; set; }

        public bool? IsEmailVerified { get; set; }

        public UserRole? ActiveRole { get; set; }

        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetExpires { get; set; }
    }
}
