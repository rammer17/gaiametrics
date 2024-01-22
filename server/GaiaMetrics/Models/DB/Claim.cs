namespace GaiaMetrics.Models.DB
{
    public class Claim
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<RoleClaim> RoleClaims { get; set; } = new List<RoleClaim>();
    }
}
