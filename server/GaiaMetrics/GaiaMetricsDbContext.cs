using Microsoft.EntityFrameworkCore;

namespace GaiaMetrics
{
    public class GaiaMetricsDbContext : DbContext
    {
        public GaiaMetricsDbContext(DbContextOptions<GaiaMetricsDbContext> options) : base(options) { }
    }
}
