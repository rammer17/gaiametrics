namespace GaiaMetrics.Models.DB
{
    public class RoleClaim
    {
        public int RoleId { get; set; }
        public Role Role { get; set; } = new Role();
        public int ClaimId { get; set; }
        public Claim Claim { get; set; } = new Claim();
    }
}
