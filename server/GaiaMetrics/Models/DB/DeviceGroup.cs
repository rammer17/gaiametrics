namespace GaiaMetrics.Models.DB
{
    public class DeviceGroup
    {
        public int Id { get; set; }
        public string Name { get; set; }

        //N:1 relationship 
        public ICollection<IoTDevice> Devices { get; set; }
        
        //N:N relationship 
        public ICollection<User> Users { get; set; }
    }
}
