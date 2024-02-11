namespace GaiaMetrics.Models.Request
{
    public class DeviceGroupUpdateRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<int> DeviceIds { get; set; }
        public ICollection<int> UserIds { get; set; }
    }
}
