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
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleGet")]
        public async Task<ActionResult<ICollection<RoleGetResponse>>> GetAll()
        {
            var result = await _roleService.GetAll();
            return Ok(result.Data);
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleAdd")]
        public async Task<ActionResult> Add(RoleAddRequest request)
        {
            var result = await _roleService.Add(request);
            return Ok(result);
        }
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleUpdate")]
        public async Task<ActionResult> Update(RoleUpdateRequest request)
        {
            var result = await _roleService.Update(request);
            return Ok(result);
        }
        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "RoleDelete")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _roleService.Delete(id);
            return Ok(result);
        }
    }
}
