using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Services;
using Microsoft.AspNetCore.Mvc;

namespace GaiaMetrics.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private GaiaMetricsDbContext _dbContext;
        private ICryptographyService _cryptographyService;
        public UserController(GaiaMetricsDbContext dbContext, ICryptographyService cryptographyService)
        {
            _dbContext = dbContext;
            _cryptographyService = cryptographyService;
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
                return BadRequest("Unable to set free subscription plan to user.");
            }

            User userToAdd = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Username = request.Username,
                Email = request.Email,
                Password = _cryptographyService.ComputeSha256Hash(request.Password),
                SubscriptionPlan = freeSubscriptionPlan,
                SubscriptionPlanId = freeSubscriptionPlan.Id
            };
            _dbContext.Users.Add(userToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
