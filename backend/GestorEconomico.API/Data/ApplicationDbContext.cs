using GestorEconomico.API.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.API.Data
{
  public class ApplicationDbContext : IdentityDbContext<ApplicationUser>

  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    { }

    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Entrada> Entradas { get; set; }
    public DbSet<Cuenta> Cuentas { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      /* CREACION ROLES POR DEFECTO */
      string ADMIN_ROL_ID = Guid.NewGuid().ToString();

      builder.Entity<IdentityRole>().HasData(
        new IdentityRole { 
            Id = ADMIN_ROL_ID, Name = "Admin", NormalizedName = "ADMIN"
        },
        new IdentityRole { 
            Id = Guid.NewGuid().ToString(), Name = "Usuario", NormalizedName = "USUARIO"
        }
      );

      /* CREACION USUARIO ADMIN */
      string ADMIN_USER_ID = Guid.NewGuid().ToString();
      var hasher = new PasswordHasher<ApplicationUser>();
      builder.Entity<ApplicationUser>().HasData(
        new ApplicationUser
        {
            Id = ADMIN_USER_ID,
            UserName = "admin@gestor_economico.com",
            NormalizedUserName = "ADMIN@GESTOR_ECONOMICO.COM",
            Email = "admin@gestor_economico.com",
            NormalizedEmail = "ADMIN@GESTOR_ECONOMICO.COM",
            EmailConfirmed = false,
            PasswordHash = hasher.HashPassword(null, "gestor123456"),
            SecurityStamp = string.Empty
        }
      );

      // ASIGNAR ROLES A USUARIOS
      builder.Entity<IdentityUserRole<string>>().HasData(
        new IdentityUserRole<string> { RoleId = ADMIN_ROL_ID, UserId = ADMIN_USER_ID }
      );

    }
  }
}