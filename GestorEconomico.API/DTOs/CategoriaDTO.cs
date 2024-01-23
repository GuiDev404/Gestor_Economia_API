using System.ComponentModel.DataAnnotations;

namespace GestorEconomico.DTOs
{
    public class CategoriaDTO
    {
        public int CategoriaId { get; set; }

        [Required(ErrorMessage = "El nombre de la categoria es requerido")]
        [StringLength(60, ErrorMessage = "El {0} no puede exceder los {1} caracteres")] // MinimumLength = 5
        public string Nombre { get; set; }
        public bool Eliminada { get; set; }
    }

    public class CategoriaCreateDTO
    {
        [Required(ErrorMessage = "El nombre de la categoria es requerido")]
        [StringLength(60, ErrorMessage = "El {0} no puede exceder los {1} caracteres")] // MinimumLength = 5
        public string Nombre { get; set; }
    }
}