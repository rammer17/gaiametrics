using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.Request
{
    public class DeviceGroupAddRequest
    {
        [Required]
        public string Name { get; set; }
        public ICollection<int> DeviceIds { get; set; }
        public ICollection<int> UserIds { get; set; }
    }
}
