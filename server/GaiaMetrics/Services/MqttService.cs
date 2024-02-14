using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GaiaMetrics.Models.ApiResponse;
using GaiaMetrics.Models.DB;
using GaiaMetrics.Models.Response;
using Microsoft.EntityFrameworkCore;
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

        private async Task<ApiResponse> HandleIncomingMessage(MqttApplicationMessageReceivedEventArgs eventArgs)
        {
            var topic = eventArgs.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(eventArgs.ApplicationMessage.Payload);

            var iotDevice = await _dbContext.IoTDevices.FirstOrDefaultAsync(x => x.Id == int.Parse(topic));

            if (iotDevice is null) return ApiResponse.BadResponse(nameof(IoTDevice), Constants.NOT_FOUND);

            List<string> list = new List<string>();
            list.AddRange(iotDevice.Data);
            list.Add(payload);
            String[] str = list.ToArray();

            iotDevice.Data = str;

            _dbContext.IoTDevices.Update(iotDevice);
            await _dbContext.SaveChangesAsync();

            return ApiResponse.CorrectResponse();
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
        public async Task<ApiResponse> SubscribeToTopicAsync(string topic)
        {
            if (!_mqttClient.IsConnected)
            {
                return ApiResponse.BadResponse(Constants.MQTT, Constants.NOT_CONNECTED);
            }

            await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());

            return ApiResponse.CorrectResponse();
        }
    }
}
