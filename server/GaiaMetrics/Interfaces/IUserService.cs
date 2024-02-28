using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using System.Security.Claims;

namespace GaiaMetrics.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponseData<ICollection<UserGetResponse>>> GetAll();
        Task<ApiResponseData<UserGetResponse>> Get(ClaimsPrincipal cp);
        Task<ApiResponse> Register(UserRegisterRequest request);
        Task<ApiResponseData<UserLoginResponse>> Login(UserLoginRequest request);

    }
}
