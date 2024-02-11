namespace GaiaMetrics.Models.Request
{
    public class IoTDeviceRegisterRequest
    {
        public string Name { get; set; }
        public double Latitude { get; set; }
        public double Longtitude { get; set; }
        public int DeviceGroupId { get; set; }
    }
}
