using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.Response
{
    public class SubscriptionPlanGetResponse
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public double Price { get; set; }
        public int SubscriptionDurationDays { get; set; }
    }
}
