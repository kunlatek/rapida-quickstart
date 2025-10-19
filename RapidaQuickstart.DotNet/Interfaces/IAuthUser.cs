using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Interfaces
{
    public interface IAuthUser
    {
        string UserId { get; }
        string Email { get; }
        List<string> Roles { get; }
        string ActiveRole { get; }
        ClaimsPrincipal ToClaimsPrincipal();
    }
}
