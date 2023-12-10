using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.Request
{
    public class SubscriptionPlanCreateRequest
    {
        public string Title { get; set; } = string.Empty;
        public double Price { get; set; }
        public int SubscriptionDurationDays { get; set; }
    }
}
