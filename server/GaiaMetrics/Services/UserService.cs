
using GaiaMetrics.Interfaces;
using GaiaMetrics.Models.ApiResponse;
using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Request;
using GaiaMetrics.Models.Response;
using GaiaMetrics.Settings;
using Microsoft.EntityFrameworkCore;
using MQTTnet.Client;
using System.Security.Claims;

namespace GaiaMetrics.Services
{
    public class UserService : IUserService
    {
        private readonly GaiaMetricsDbContext _dbContext;
        private readonly IJwtService _jwtService;
        private readonly ICryptographyService _cryptographyService;
        private readonly IConfiguration _configuration;
        private readonly IMqttService _mqttService;
        public UserService(GaiaMetricsDbContext dbContext, IJwtService jwtService, ICryptographyService cryptographyService, IConfiguration configuration, IMqttService mqttService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
            _cryptographyService = cryptographyService;
            _configuration = configuration;
            _mqttService = mqttService;
        }
        public async Task<ApiResponseData<UserGetResponse>> Get(ClaimsPrincipal cp)
        {
            var user = _dbContext.Users.Include(x => x.SubscriptionPlan).FirstOrDefault(x => x.Id == _jwtService.GetUserIdFromToken(cp));

            if (user is null)
            {
                return ApiResponseData<UserGetResponse>.BadResponse(nameof(User), Constants.NOT_FOUND);
            }

            var response = new UserGetResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                SubscriptionPlanName = user.SubscriptionPlan.Title,
                TimeUnitlSubscriptionExpires = user.SubscriptionExpiryTime - DateTime.UtcNow
            };

            return ApiResponseData<UserGetResponse>.CorrectResponse(response);
        }

        public async Task<ApiResponseData<ICollection<UserGetResponse>>> GetAll()
        {
            var response = _dbContext.Users.Select(x => new UserGetResponse
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                Username = x.Username,
                SubscriptionPlanName = x.SubscriptionPlan.Title,
                TimeUnitlSubscriptionExpires = x.SubscriptionExpiryTime - DateTime.UtcNow
            }).ToList();

            return ApiResponseData<ICollection<UserGetResponse>>.CorrectResponse(response);
        }

        public async Task<ApiResponseData<UserLoginResponse>> Login(UserLoginRequest request)
        {
            if (//if the username is not correct return, there is no way to know which user attempted the login
                !_dbContext.Users.Any(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username) ||

                //check if the user with the username is locked, if locked return 
                _dbContext.Users.First(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username).DateLockedTo > DateTime.UtcNow)
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(Constants.CREDENTIALS, Constants.INCORRECT);
            }

            //if a user with the given username already exists and is not locked out try to pull a user object with the password
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username && x.Password == _cryptographyService.ComputeSha256Hash(request.Password));

            //if password is incorrect but username is correct increse login attempt count of the user by 1
            if (user is null)
            {
                var userFailedLogin = _dbContext.Users
                    .First(x => EF.Functions.Collate(x.Username, "SQL_Latin1_General_CP1_CS_AS") == request.Username);

                userFailedLogin.LoginAttemptCount++;
                if (userFailedLogin.LoginAttemptCount >= 5)
                {
                    userFailedLogin.DateLockedTo = DateTime.UtcNow.AddHours(2);
                    userFailedLogin.LoginAttemptCount = 0;
                }

                await _dbContext.SaveChangesAsync();
                return ApiResponseData<UserLoginResponse>.BadResponse(Constants.CREDENTIALS, Constants.INCORRECT);
            }

            var claims = _dbContext.RoleClaims
                .Where(x => x.RoleId == user.RoleId)
                .Select(x => x.Claim.Name)
                .Distinct().ToList();

            var token = _jwtService.CreateToken(user.Id, user.Username, claims, _configuration["Jwt:Key"], _configuration["Jwt:Issuer"], _configuration["Jwt:Audience"]);
            var response = new UserLoginResponse
            {
                Token = token
            };

            //Map broker host settings
            BrokerHostSettings brokerHostSettings = new BrokerHostSettings();
            _configuration.GetSection(nameof(BrokerHostSettings)).Bind(brokerHostSettings);

            //Map client settings
            ClientSettings clientSettings = new ClientSettings();
            _configuration.GetSection(nameof(ClientSettings)).Bind(clientSettings);

            if (!string.IsNullOrEmpty(token))
            {
                // Create and connect MQTT client with JWT token as clientId
                var mqttClientOptions = new MqttClientOptionsBuilder()
                    .WithClientId(token)
                    .WithTcpServer(brokerHostSettings.Host, brokerHostSettings.Port)
                    .WithCredentials(clientSettings.UserName, clientSettings.Password)
                    .Build();

                await _mqttService.CreateAndConnectMqttClient(mqttClientOptions);
/*                await _mqttService.SubscribeToTopicAsync("api");*/
            }


            return ApiResponseData<UserLoginResponse>.CorrectResponse(response);
        }

        public async Task<ApiResponse> Register(UserRegisterRequest request)
        {
            if (request.Username.Length > 30 || request.Username.Length < 3)
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(nameof(User), Constants.INCORRECT_LENGTH);
            }

            if (_dbContext.Users.Any(x => x.Username == request.Username))
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(Constants.USERNAME, Constants.ALREADY_EXISTS);
            }

            if (request.Password.Length < 8)
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(Constants.PASSWORD, Constants.SHORT);
            }

            if (_dbContext.Users.Any(x => x.Email == request.Email))
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(Constants.EMAIL, Constants.ALREADY_EXISTS);
            }

            var freeSubscriptionPlan = await _dbContext.SubscriptionPlans.FirstOrDefaultAsync(x => x.Title == "Free");

            if (freeSubscriptionPlan is null)
            {
                return ApiResponseData<UserLoginResponse>.BadResponse(nameof(SubscriptionPlan), Constants.NOT_FOUND);
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
                Role = await _dbContext.Roles.FirstAsync(x => x.Id == 1),
                RoleId = 1
            };
            await _dbContext.Users.AddAsync(userToAdd);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
        }
    }
}
