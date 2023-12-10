namespace GaiaMetrics.Models.DB
{
    public class SubscriptionPlan
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public double Price { get; set; }
        public DateTime ExpiryTime { get; set; }

        //Required 1:M
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
