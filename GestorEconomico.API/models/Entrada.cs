using System.ComponentModel.DataAnnotations;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Models
{
  public class Entrada
  {
    [Key]
    public int EntradaId { get; set; }
  
    public string Descripcion { get; set; }
    public TiposEntradas TiposEntrada { get; set; }

    public double Monto { get; set; }

    public string UsuarioID { get; set; }

    public DateTime FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }

    public byte[]? File { get; set; } // Comprobante

    public string? FileType { get; set; } // MimeTypeComprobante
    public string? Filename { get; set; } // NombreArchivo

    // [NotMapped]
    // public string? ComprobanteBase64 { get; set; }

    public bool Eliminada { get; set; }

    public int CategoriaId { get; set; }
    public virtual Categoria? Categoria { get; set; }
  } 
}