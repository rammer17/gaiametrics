using GaiaMetrics.Models.Response;
using GaiaMetrics.Models.Request;

namespace GaiaMetrics.Interfaces
{
    public interface ISubscriptionPlanService
    {
        Task<ApiResponseData<ICollection<SubscriptionPlanGetResponse>>> GetAll();
        Task<ApiResponse> Create(SubscriptionPlanCreateRequest request);
        Task<ApiResponse> Delete(int id);
    }
}
