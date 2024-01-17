using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.DB
{
    public class SubscriptionPlan
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public double Price { get; set; }
        [Required]
        public int DaysDuration { get; set; }

        //Required M:1
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
