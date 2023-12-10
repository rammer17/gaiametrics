using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.DB
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }


        //Optional 1:1
        public Contributor? Contributor { get; set; }

        //Required 1:M
        public int SubscriptionPlanId { get; set; }
        public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    }
}
