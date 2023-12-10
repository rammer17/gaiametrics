using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class SubscriptionPlanController : ControllerBase
    {
        private GaiaMetricsDbContext _dbContext;
        public SubscriptionPlanController(GaiaMetricsDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public IActionResult Create(SubscriptionPlanCreateRequest request) 
        {
            if (_dbContext.SubscriptionPlans.Any(x => x.Title == request.Title)) 
            {
                return BadRequest("Subscription plan with the given title already exists.");
            }

            if (_dbContext.SubscriptionPlans.Any(x => x.Price < 0))
            {
                return BadRequest("Invalid price.");
            }

            var subscriptionPlanToAdd = new SubscriptionPlan
            {
                Title = request.Title,
                Price = request.Price,
                SubscriptionDuration = TimeSpan.FromDays(request.SubscriptionDurationDays)
            };
            _dbContext.SubscriptionPlans.Add(subscriptionPlanToAdd);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
