using GaiaMetrics.Interfaces;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class SubscriptionPlanController : ControllerBase
    {
        private readonly ISubscriptionPlanService _subscriptionPlanService;
        public SubscriptionPlanController(ISubscriptionPlanService subscriptionPlanService)
        {
            _subscriptionPlanService = subscriptionPlanService;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "SubscriptionPlanGet")]
        public async Task<ActionResult<List<SubscriptionPlanGetResponse>>> GetAll()
        {
            var result = await _subscriptionPlanService.GetAll();
            return Ok(result.Data);
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "SubscriptionPlanCreate")]
        public async Task<IActionResult> Create(SubscriptionPlanCreateRequest request)
        {
            var result = _subscriptionPlanService.Create(request);
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "SubscriptionPlanDelete")]
        public IActionResult Delete(int id)
        {
            var result = _subscriptionPlanService.Delete(id);
            return Ok(result);
        }
    }
}
