using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;

namespace GaiaMetrics.Services
{
    public interface IDeviceGroupService
    {
        Task<ApiResponseData<ICollection<DeviceGroupGetResponse>>> GetAll();
        Task<ApiResponse> Register(DeviceGroupAddRequest request);
        Task<ApiResponse> Update(DeviceGroupUpdateRequest request);
        Task<ApiResponse> Delete(int id);

    }
}
