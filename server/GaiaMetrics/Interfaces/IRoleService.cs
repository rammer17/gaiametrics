using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;

namespace GaiaMetrics.Interfaces
{
    public interface IRoleService
    {
        Task<ApiResponseData<ICollection<RoleGetResponse>>> GetAll();
        Task<ApiResponse> Add(RoleAddRequest request);
        Task<ApiResponse> Update(RoleUpdateRequest request);
        Task<ApiResponse> Delete(int id);
    }
}
