using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.DB
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;

        public DateTime SubscriptionExpiryTime { get; set; }


        //Optional 1:1
        public Contributor? Contributor { get; set; }

        //Required 1:M
        public int SubscriptionPlanId { get; set; }
        public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    }
}
