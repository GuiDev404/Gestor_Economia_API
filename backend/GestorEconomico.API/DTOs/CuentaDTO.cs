using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GestorEconomico.API.DTOs
{
    public class CuentaDTO
    {
        public int CuentaId { get; set; }
  
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
    
        public string UsuarioID { get; set; }

        public string Color { get; set; }
        public string Emoji { get; set; }
        public bool Eliminada { get; set; }

    }
    
    public class CuentaCreateDTO
    {
        [Required(ErrorMessage = "El nombre de la cuenta es requerido")]
        [StringLength(30, ErrorMessage = "El nombre no puede exceder los {1} caracteres")]
        public string Titulo { get; set; }
        
        [Required(ErrorMessage = "La descripcion de la cuenta es requerido")]
        [StringLength(60, ErrorMessage = "La descripcion no puede exceder los {1} caracteres")]
        public string Descripcion { get; set; }
    
        public string Color { get; set; }

        [Required(ErrorMessage = "El emoji para la cuenta es requerido")]
        public string Emoji { get; set; }
    }

    public class CuentaUpdateDTO: CuentaCreateDTO
    {
        [Required(ErrorMessage = "El id de la cuenta es requerida")]
        public int CuentaId { get; set; }
    }
}