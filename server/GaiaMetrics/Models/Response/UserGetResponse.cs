using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.Response
{
    public class UserGetResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SubscriptionPlanName { get; set; }
        public TimeSpan? TimeUnitlSubscriptionExpires { get; set; }

    }
}
