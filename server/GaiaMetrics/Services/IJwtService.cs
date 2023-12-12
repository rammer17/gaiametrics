using System.Security.Claims;

namespace GaiaMetrics.Services
{
    public interface IJwtService
    {
        string CreateToken(int userId, string roleName, List<string> roleClaims, string jwtKey, string jwtIssuer, string jwtAudience);
        List<string> GetUserClaimsFromToken(ClaimsPrincipal user);
        int GetUserIdFromToken(ClaimsPrincipal user);
        string GetUserRoleNameFromToken(ClaimsPrincipal user);
    }
}