using GaiaMetrics.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics
{
    public class GaiaMetricsDbContext : DbContext
    {
        public GaiaMetricsDbContext(DbContextOptions<GaiaMetricsDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Contributor> Contributors { get; set; }
    }
}
