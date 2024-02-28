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
        public DbSet<DeviceGroup> DeviceGroups { get; set; }
        public DbSet<IoTDevice> IoTDevices { get; set; }
        public DbSet<IoTDeviceData> IoTDevicesData { get; set; }

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

/*            modelBuilder.Entity<IoTDeviceData>().HasNoKey().ToTable(null, t => t.ExcludeFromMigrations());*/


            modelBuilder.Entity<IoTDeviceData>()
                .HasOne<IoTDevice>(s => s.IoTDevice)
                .WithMany(g => g.Data)
                .HasForeignKey(s => s.IoTDeviceId);

            /*            modelBuilder.Entity<IoTDevice>()
                                    .Property(e => e.Data)
                                    .HasConversion(
                                        v => string.Join(',', v),
                                        v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));*/
        }
    }
}
