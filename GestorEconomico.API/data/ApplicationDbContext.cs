using GestorEconomico.Models;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.Data
{
  public class ApplicationDbContext : DbContext

  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    { }

    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Entrada> Entradas { get; set; }

  }
}