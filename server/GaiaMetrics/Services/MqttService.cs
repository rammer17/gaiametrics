using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.ManagedClient;

namespace GaiaMetrics.Services
{
    public class MqttService : IMqttService
    {
        private readonly IMqttClient _mqttClient;
        private MqttClientOptions _mqttOptions;
        private GaiaMetricsDbContext _dbContext;
        public MqttService(IMqttClient mqttClient, MqttClientOptions mqttOptions, GaiaMetricsDbContext dbContext)
        {
            _mqttClient = mqttClient;
            _mqttOptions = mqttOptions;
            _dbContext = dbContext;

            // Subscribe to message received event
            _mqttClient.ApplicationMessageReceivedAsync += HandleIncomingMessage;
        }

        private async Task HandleIncomingMessage(MqttApplicationMessageReceivedEventArgs eventArgs)
        {
            var topic = eventArgs.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(eventArgs.ApplicationMessage.Payload);

            var userId = GetUserIdFromClientId(eventArgs.ClientId);
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == int.Parse(userId));

            if (user is null) return;
        }

        public async Task CreateAndConnectMqttClient(MqttClientOptions options)
        {
            _mqttOptions = options;
            await ConnectAsync();
        }
        public async Task ConnectAsync()
        {
            if (_mqttClient.IsConnected)
            {
                return; // Already connected
            }
            await _mqttClient.ConnectAsync(_mqttOptions, CancellationToken.None);
        }
        public async Task SubscribeToTopicAsync(string topic)
        {
            if (!_mqttClient.IsConnected)
            {
                throw new InvalidOperationException("MQTT client is not connected.");
            }

            await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());
        }

        private string GetUserIdFromClientId(string jwtToken)
        {
            // Decode the JWT token
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwtToken);

            // Extract claims from the JWT token
            var claims = token.Claims;

            // Find the "Name" claim
            var userId = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            return userId;
        }
    }
}
