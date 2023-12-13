using GaiaMetrics.Migrations;
using GaiaMetrics.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics
{
    public class GaiaMetricsDbContext : DbContext
    {
        public GaiaMetricsDbContext(DbContextOptions<GaiaMetricsDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Contributor> Contributors { get; set; }
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<RoleClaim> RoleClaims { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Role - Claim many to many
            modelBuilder.Entity<RoleClaim>()
                .HasKey(rc => new { rc.RoleId, rc.ClaimId });
            modelBuilder.Entity<RoleClaim>()
                .HasOne(rc => rc.Claim)
                .WithMany(c => c.RoleClaims)
                .HasForeignKey(rc => rc.ClaimId);
            modelBuilder.Entity<RoleClaim>()
                .HasOne(rc => rc.Role)
                .WithMany(r => r.RoleClaims)
                .HasForeignKey(rc => rc.RoleId);
        }
    }
}
