using MQTTnet.Client;

namespace GaiaMetrics.Services
{
    public interface IMqttService
    {
        Task CreateAndConnectMqttClient(MqttClientOptions options);
        Task ConnectAsync();
        Task SubscribeToTopicAsync(string topic);
    }
}
