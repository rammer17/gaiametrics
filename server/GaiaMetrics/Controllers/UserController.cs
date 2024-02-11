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
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        public async Task<ActionResult<UserGetResponse>> Get()
        {
            var result = await _userService.Get(User);
            return Ok(result.Data);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserGetAll")]
        public async Task<ActionResult<UserGetResponse>> GetAll()
        {
            var result = await _userService.GetAll();
            return Ok(result.Data);
        }

        [HttpPost]
        public async Task<IActionResult> Register(UserRegisterRequest request)
        {
            var result = await _userService.Register(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<UserLoginResponse>> Login(UserLoginRequest request)
        {
            var result = await _userService.Login(request);
            return Ok(result.Data);
        }
    }
}
