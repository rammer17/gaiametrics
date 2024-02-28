using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Services
{
    public interface IIoTDeviceService
    {
        Task<ApiResponseData<ICollection<IoTDeviceGetResponse>>> GetAll();
        Task<ApiResponseData<IoTDeviceGetResponse>> Get(int id);
        Task<ApiResponse> Register(IoTDeviceRegisterRequest request);
    }
}
