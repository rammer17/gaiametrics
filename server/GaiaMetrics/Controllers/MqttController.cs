using GaiaMetrics.Services;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class MqttController : ControllerBase
    {
        private readonly IMqttService _mqttService;

        public MqttController(IMqttService mqttService)
        {
            _mqttService = mqttService;
        }

        [HttpPost]
        /*[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "MqttSubscribe")]*/
        public async Task<IActionResult> Subscribe(string topic)
        {
            var result = await _mqttService.SubscribeToTopicAsync(topic);
            return Ok(result);
        }
    }
}
