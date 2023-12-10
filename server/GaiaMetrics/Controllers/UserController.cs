using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using GaiaMetrics.Services;
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
        public UserController(GaiaMetricsDbContext dbContext, ICryptographyService cryptographyService, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _cryptographyService = cryptographyService;
            _configuration = configuration;
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
                return BadRequest("Incorrect username");
            }

            //check if the user with the username is locked, if locked return 
            if (_dbContext.Users.Where(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username).First().DateLockedTo > DateTime.UtcNow)
            {
                return BadRequest("Too many login attempts. Please try again later.");
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

            var token = CreateJwtToken(user);
            var response = new UserLoginResponse
            {
                Token = token
            };

            return Ok(response);
        }
        private string CreateJwtToken(User user)
        {
            List<System.Security.Claims.Claim> identityClaims = new List<System.Security.Claims.Claim>()
            {
                new System.Security.Claims.Claim(ClaimTypes.Name, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: identityClaims,
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
