using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;

namespace GestorEconomico.API.Mapper
{
    public class CuentaMapper : ICuentaMapper
    {
        private CuentaDTO CuentaToDTO (Cuenta cuenta) {
            return new CuentaDTO {
                    CuentaId = cuenta.CuentaId,
                    Eliminada = cuenta.Eliminada,
                    Titulo = cuenta.Titulo,
                    Descripcion = cuenta.Descripcion,
                    Color = cuenta.Color,
                    Emoji = cuenta.Emoji,
                    UsuarioID = cuenta.UsuarioID
                };
        }

        public IEnumerable<CuentaDTO> Map(IEnumerable<Cuenta> source)=> source.Select(CuentaToDTO);
        public CuentaDTO Map(Cuenta source)=> CuentaToDTO(source);

        public Cuenta Map(CuentaDTO source)
        {
            return new Cuenta {
                CuentaId = source.CuentaId,
                Titulo = source.Titulo,
                Descripcion = source.Descripcion,
                Color = source.Color,
                Emoji = source.Emoji,
                Eliminada = source.Eliminada,
                UsuarioID = source.UsuarioID,
            };
        }

        public Cuenta Map(CuentaCreateDTO source)
        {
            return new Cuenta {
                Titulo = source.Titulo,
                Descripcion = source.Descripcion,
                Color = source.Color,
                Emoji = source.Emoji,
            };
        }
       
        public Cuenta Map(Cuenta result, CuentaUpdateDTO cuentaUpdateDTO)
        {
            result.Descripcion = cuentaUpdateDTO.Descripcion;
            result.Titulo = cuentaUpdateDTO.Titulo;
            result.Color = cuentaUpdateDTO.Color;
            result.Emoji = cuentaUpdateDTO.Emoji;
            return result;
        }
      
    }
}