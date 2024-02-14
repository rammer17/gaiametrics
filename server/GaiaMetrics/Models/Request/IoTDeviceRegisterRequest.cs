namespace GaiaMetrics.Models.Request
{
    public class IoTDeviceRegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public double Latitude { get; set; } = 0;
        public double Longtitude { get; set; } = 0;
        public int DeviceGroupId { get; set; } = 0;
    }
}
