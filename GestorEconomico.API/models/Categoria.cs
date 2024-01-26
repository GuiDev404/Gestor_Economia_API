using System.ComponentModel.DataAnnotations;

namespace GestorEconomico.API.Models
{
  public class Categoria
  {
    [Key]
    public int CategoriaId { get; set; }

    public string Nombre { get; set; }

    public bool Eliminada { get; set; }
  
    public virtual ICollection<Entrada>? Entradas { get; set; }
  }
}