using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaiaMetrics.Models.DB
{
    public class IoTDevice
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longtitude { get; set; }

        //1:N relationship 
        public int? DeviceGroupId { get; set; }
        public DeviceGroup? DeviceGroup { get; set; }
        public ICollection<IoTDeviceData> Data { get; set; }
    }

    public class IoTDeviceData
    {
        public int Id { get; set; }
        public int IoTDeviceId { get; set; }
        public IoTDevice IoTDevice { get; set; }
        public string DataType { get; set; } = string.Empty;
        public string DataValue { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
