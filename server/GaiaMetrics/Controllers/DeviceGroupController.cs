using GaiaMetrics.Models.Request;
using GaiaMetrics.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DeviceGroupController : ControllerBase
    {
        private readonly IDeviceGroupService _deviceGroupService;
        public DeviceGroupController(IDeviceGroupService deviceGroupService)
        {
            _deviceGroupService = deviceGroupService;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "DeviceGroupGet")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _deviceGroupService.GetAll();
            return Ok(result.Data);
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "DeviceGroupCreate")]
        public async Task<IActionResult> Register(DeviceGroupAddRequest request)
        {
            var result = await _deviceGroupService.Register(request);
            return Ok(result);
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "DeviceGroupUpdate")]
        public async Task<IActionResult> Update(DeviceGroupUpdateRequest request)
        {
            var result = await _deviceGroupService.Update(request);
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "DeviceGroupDelete")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _deviceGroupService.Delete(id);
            return Ok(result);
        }
    }
}
