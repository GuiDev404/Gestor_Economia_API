using System.ComponentModel.DataAnnotations;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Models
{
  public class Categoria
  {
    [Key]
    public int CategoriaId { get; set; }

    public string Nombre { get; set; }

    public TiposEntradas TipoEntrada { get; set; }
    public string Color { get; set; }
    public string Emoji { get; set; }
    public string UsuarioID { get; set; }
    public bool Eliminada { get; set; }

    public virtual ICollection<Entrada>? Entradas { get; set; }
  }
}