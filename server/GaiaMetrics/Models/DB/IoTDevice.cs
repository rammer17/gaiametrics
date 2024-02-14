namespace GaiaMetrics.Models.DB
{
    public class IoTDevice
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Latitude { get; set; }
        public double Longtitude { get; set; }

        //1:N relationship 
        public int? DeviceGroupId { get; set; }
        public DeviceGroup? DeviceGroup { get; set; }

        public string[] Data { get; set; }
    }
}
