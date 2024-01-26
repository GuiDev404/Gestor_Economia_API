using System.ComponentModel.DataAnnotations;
using GestorEconomico.API.Models;

namespace GestorEconomico.API.DTOs
{
  public class UsuarioRolesDTO
  {
    public ApplicationUser Usuario { get; set; }
    public IList<string> Roles { get; set; }
  }

  public class LoginUserDTO
  {
    [Display(Name = "correo")]
    [Required(ErrorMessage = "El {0} es requerido, ingrese uno")]
    [EmailAddress(ErrorMessage = "Ingrese un {0} valido")]
    public string Correo { get; set; }

    [DataType(DataType.Password)]
    [Required(ErrorMessage = "La {0} es requerida, ingrese una")]
    [StringLength(32, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre {2} y {1} caracteres.")]
    public string Contraseña { get; set; }
  }

  public class RegisterUserDTO : LoginUserDTO
  {
    [DataType(DataType.Password)]
    [Required(ErrorMessage = "La confirmación de contraseña es requerida, ingrese una")]
    [Compare("Contraseña", ErrorMessage = "La contraseña y la confirmación de contraseña deben coincidir")]
    [StringLength(32, MinimumLength = 6, ErrorMessage = "La confirmación de contraseña debe tener entre {2} y {1} caracteres.")]
    public string ConfirmarContraseña { get; set; }
  }
}