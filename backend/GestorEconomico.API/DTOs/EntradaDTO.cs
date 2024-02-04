using System.ComponentModel.DataAnnotations;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.DTOs
{
    public class EntradaDTO
    {
        public int EntradaId { get; set; }
        public string Descripcion { get; set; }
        public TiposEntradas TiposEntrada { get; set; }
        public double Monto { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        public bool Eliminada { get; set; }
        public int CategoriaId { get; set; }
        public string? CategoriaNombre { get; set; }
        public byte[]? File { get; set; }
        public string? FileType { get; set; }
        public string? Filename { get; set; }
    }

    public class EntradaCreateDTO
    {
        [Required(ErrorMessage = "Ingrese una descripcion para la entrada")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "Ingrese un monto para la entrada")]
        public double Monto { get; set; }

        [Required(ErrorMessage = "Seleccione una fecha de inicio para la entrada")]
        [DataType(DataType.DateTime, ErrorMessage = "Ingrese una fecha valida")]
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public IFormFile? Comprobante { get; set; }

        [Required(ErrorMessage = "Seleccione una categoria para la entrada")]
        public int CategoriaId { get; set; }
    }

    public class EntradaUpdateDTO: EntradaCreateDTO {
        [Required(ErrorMessage = "Debe actualizar una entrada")]
        public int EntradaId { get; set; }
        // public string UsuarioID { get; set; }
    }
}