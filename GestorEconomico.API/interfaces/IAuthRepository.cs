using GestorEconomico.API.DTOs;
using GestorEconomico.API.Models;
using Microsoft.AspNetCore.Identity;

namespace GestorEconomico.API.Interfaces
{
   public interface IAuthRepository {
      Task<bool> CreateUser (string email, string password, string rol);

      Task<ApplicationUser> GetUserByEmail (string email);
      Task<UsuarioRolesDTO> GetCurrentUser(string userId);
      Task<ApplicationUser> GetUserByRefreshToken(string refreshToken);
      Task<IList<string>> GetUserRoles (ApplicationUser user);

      Task<IdentityRole> GetRoleByName(string roleName);
      Task<dynamic> CreationTokens(UsuarioRolesDTO usuarioConRol);

      Task<bool> IsCorrectPassword (ApplicationUser usuario, string password);
      Task<bool> ExistUser (string email);
      Task<bool> Save ();
   }
}