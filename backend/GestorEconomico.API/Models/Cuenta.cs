using System.ComponentModel.DataAnnotations;

namespace GestorEconomico.API.Models
{
  public class Cuenta {
    [Key]
    public int CuentaId { get; set; }
  
    public string Titulo { get; set; }
    public string Descripcion { get; set; }
 
    public string UsuarioID { get; set; }

    public string Color { get; set; }
    public string Emoji { get; set; }
    public bool Eliminada { get; set; }

    public virtual ICollection<Entrada>? Entradas { get; set; }
  }
}