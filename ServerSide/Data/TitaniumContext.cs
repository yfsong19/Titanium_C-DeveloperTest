using Microsoft.EntityFrameworkCore;
using Titanium.Models;

namespace Titanium.Data
{
    public class TitaniumContext : DbContext
    {
        public TitaniumContext(DbContextOptions<TitaniumContext> options) : base(options) { }

        public DbSet<Stock> Stocks { get; set; } = null!;
    }
}
