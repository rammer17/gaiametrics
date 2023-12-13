using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using GaiaMetrics.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private GaiaMetricsDbContext _dbContext;
        private ICryptographyService _cryptographyService;
        private IConfiguration _configuration;
        private IJwtService _jwtService;
        public UserController(GaiaMetricsDbContext dbContext, ICryptographyService cryptographyService, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _cryptographyService = cryptographyService;
            _configuration = configuration;
            _jwtService = jwtService;
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        public ActionResult<UserGetResponse> GetByJwtToken()
        {
            var user = _dbContext.Users.Where(x => x.Id == _jwtService.GetUserIdFromToken(User)).FirstOrDefault();

            if (user == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var response = new UserGetResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                SubscriptionPlanId = user.SubscriptionPlanId,
                TimeUnitlSubscriptionExpires = user.SubscriptionExpiryTime - DateTime.UtcNow
            };

            return Ok(response);

        }
        [HttpPost]
        public IActionResult Register(UserRegisterRequest request)
        {
            if (request.Username.Length > 30 || request.Username.Length < 3)
            {
                return BadRequest("A username can not be shorter that 3 symbols or longer than 30 symbols.");
            }

            if (_dbContext.Users.Any(x => x.Username == request.Username))
            {
                return BadRequest("Username already taken.");
            }

            if (request.Password.Length < 8)
            {
                return BadRequest("Password must be longer than 8 symbols.");
            }

            if (_dbContext.Users.Any(x => x.Email == request.Email))
            {
                return BadRequest("There is already a user registered with this email address.");
            }

            var freeSubscriptionPlan = _dbContext.SubscriptionPlans.Where(x => x.Title == "Free").FirstOrDefault();

            if (freeSubscriptionPlan == null)
            {
                return BadRequest("Free subscription plan not found.");
            }

            User userToAdd = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Username = request.Username,
                Email = request.Email,
                Password = _cryptographyService.ComputeSha256Hash(request.Password),
                SubscriptionPlan = freeSubscriptionPlan,
                SubscriptionPlanId = freeSubscriptionPlan.Id,
            };
            _dbContext.Users.Add(userToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPost]
        public ActionResult<UserLoginResponse> Login(UserLoginRequest request)
        {
            //if the username is not correct return, there is no way to know which user attempted the login
            if (!_dbContext.Users.Any(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username))
            {
                return BadRequest("Incorrect credentials.");
            }

            //check if the user with the username is locked, if locked return 
            if (_dbContext.Users.Where(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username).First().DateLockedTo > DateTime.UtcNow)
            {
                return BadRequest("Incorrect credentials.");
            }

            //if a user with the given username already exists and is not locked out try to pull a user object with the password
            var user = _dbContext.Users
                .Where(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username && x.Password == _cryptographyService.ComputeSha256Hash(request.Password))
                .FirstOrDefault();

            //if password is incorrect but username is correct increse login attempt count of the user by 1
            if (user == null)
            {
                var userFailedLogin = _dbContext.Users
                    .Where(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username)
                    .First();

                userFailedLogin.LoginAttemptCount++;
                if (userFailedLogin.LoginAttemptCount >= 5)
                {
                    userFailedLogin.DateLockedTo = DateTime.UtcNow.AddHours(2);
                    userFailedLogin.LoginAttemptCount = 0;
                }

                _dbContext.SaveChanges();
                return BadRequest("Incorrect credentials.");
            }

            var token = _jwtService.CreateToken(user.Id, _configuration["Jwt:Key"], _configuration["Jwt:Issuer"], _configuration["Jwt:Audience"]);

            var response = new UserLoginResponse
            {
                Token = token
            };

            return Ok(response);
        }
    }
}
