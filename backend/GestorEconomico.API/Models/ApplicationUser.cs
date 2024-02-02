using Microsoft.AspNetCore.Identity;

namespace GestorEconomico.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? RefreshToken { get; set; }
    }
}