namespace GaiaMetrics.Models.Response
{
    public class DeviceGroupGetResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<IoTDeviceGetResponse> Devices { get; set; }
    }
}
