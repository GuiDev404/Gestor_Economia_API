using System.ComponentModel.DataAnnotations;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.DTOs
{
    public class CategoriaDTO
    {
        public int CategoriaId { get; set; }

        public string Nombre { get; set; }
        public bool Eliminada { get; set; }
        public string UsuarioID { get; set; }

        public TiposEntradas TipoEntrada { get; set; }
        public string Color { get; set; }
        public string Emoji { get; set; }
    }

    public class CategoriaCreateDTO
    {
        [Required(ErrorMessage = "El nombre de la categoria es requerido")]
        [StringLength(60, ErrorMessage = "El {0} no puede exceder los {1} caracteres")] // MinimumLength = 5
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El tipo para la categoria es requerido")]
        [EnumDataType(typeof(TiposEntradas), ErrorMessage = "El valor proporcionado no es un tipo de entrada válido")]
        public TiposEntradas TipoEntrada { get; set; }

        // [Required(ErrorMessage = "El color para la categoria es requerido")]
        public string Color { get; set; }

        [Required(ErrorMessage = "El emoji para la categoria es requerido")]
        public string Emoji { get; set; }
    }

    public class CategoriaUpdateDTO: CategoriaCreateDTO 
    {
        [Required(ErrorMessage = "El id de la categoria es requerida")]
        public int CategoriaId { get; set; }

    }
}