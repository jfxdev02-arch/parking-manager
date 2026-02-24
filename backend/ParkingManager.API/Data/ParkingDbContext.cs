using Microsoft.EntityFrameworkCore;
using ParkingManager.API.Models;

namespace ParkingManager.API.Data;

public class ParkingDbContext : DbContext
{
    public ParkingDbContext(DbContextOptions<ParkingDbContext> options) : base(options) { }
    
    public DbSet<Vaga> Vagas { get; set; } = null!;
    public DbSet<Ocupacao> Ocupacoes { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vaga>(entity =>
        {
            entity.HasIndex(v => v.Numero).IsUnique();
        });
        
        modelBuilder.Entity<Ocupacao>(entity =>
        {
            entity.HasOne(o => o.Vaga)
                  .WithMany()
                  .HasForeignKey(o => o.VagaId);
        });
    }
}
