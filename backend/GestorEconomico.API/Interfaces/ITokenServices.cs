using GestorEconomico.API.DTOs;

namespace GestorEconomico.API.Interfaces {
  public interface ITokenServices
    {
        string CreateAccessToken (UsuarioRolesDTO usuarioConRol);
        string CreateRefreshToken ();
    }
}