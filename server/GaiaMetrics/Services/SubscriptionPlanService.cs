using GaiaMetrics.Interfaces;
using GaiaMetrics.Models.ApiResponse;
using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics.Services
{
    public class SubscriptionPlanService : ISubscriptionPlanService
    {
        private readonly GaiaMetricsDbContext _dbContext;
        public SubscriptionPlanService(GaiaMetricsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse> Create(SubscriptionPlanCreateRequest request)
        {
            if (await _dbContext.SubscriptionPlans.AnyAsync(x => x.Title == request.Title))
            {
                return ApiResponse.BadResponse(nameof(SubscriptionPlan), Constants.ALREADY_EXISTS);
            }

            if (_dbContext.SubscriptionPlans.Any(x => x.Price < 0))
            {
                return ApiResponse.BadResponse(Constants.PRICE, Constants.INVALID);
            }

            var subscriptionPlanToAdd = new SubscriptionPlan
            {
                Title = request.Title,
                Price = request.Price,
                DaysDuration = request.DaysDuration
            };
            await _dbContext.SubscriptionPlans.AddAsync(subscriptionPlanToAdd);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }

        public async Task<ApiResponse> Delete(int id)
        {
            var subscriptionPlanToDelete = await _dbContext.SubscriptionPlans.FirstOrDefaultAsync(x => x.Id == id);

            if (subscriptionPlanToDelete is null)
            {
                return ApiResponse.BadResponse(nameof(SubscriptionPlan), Constants.NOT_FOUND);
            }

            _dbContext.SubscriptionPlans.Remove(subscriptionPlanToDelete);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }

        public async Task<ApiResponseData<ICollection<SubscriptionPlanGetResponse>>> GetAll()
        {
            var subscriptionPlans = await _dbContext.SubscriptionPlans
                .Select(x => new SubscriptionPlanGetResponse()
                {
                    Id = x.Id,
                    Title = x.Title,
                    Price = x.Price,
                    SubscriptionDurationDays = x.DaysDuration
                }).ToListAsync();

            return ApiResponseData<ICollection<SubscriptionPlanGetResponse>>.CorrectResponse(subscriptionPlans);
        }
    }
}
