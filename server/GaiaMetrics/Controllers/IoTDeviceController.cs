using GaiaMetrics.Models.Request;
using GaiaMetrics.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class IoTDeviceController : ControllerBase
    {
        private readonly IIoTDeviceService _iotService;
        public IoTDeviceController(IIoTDeviceService iotService)
        {
            _iotService = iotService;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IoTDeviceGet")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _iotService.GetAll();
            return Ok(result.Data);

        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IoTDeviceGet")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _iotService.Get(id);
            return Ok(result.Data);
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IoTDeviceCreate")]
        public async Task<ActionResult> Register(IoTDeviceRegisterRequest request)
        {
            var result = await _iotService.Register(request);
            return Ok(result);
        }
    }
}
