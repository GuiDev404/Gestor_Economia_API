using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;

namespace GestorEconomico.API.Mapper
{
    public class CategoriaMapper : ICategoriaMapper
    {
        private CategoriaDTO CategoriaToDTO (Categoria categoria) {
            return new CategoriaDTO {
                    CategoriaId = categoria.CategoriaId,
                    Eliminada = categoria.Eliminada,
                    Nombre = categoria.Nombre,
                    Color = categoria.Color,
                    Emoji = categoria.Emoji,
                    TipoEntrada = categoria.TipoEntrada,
                    UsuarioID = categoria.UsuarioID
                };
        }

        public IEnumerable<CategoriaDTO> Map(IEnumerable<Categoria> source)=> source.Select(CategoriaToDTO);
        public CategoriaDTO Map(Categoria source)=> CategoriaToDTO(source);

        public Categoria Map(CategoriaDTO source)
        {
            return new Categoria {
                CategoriaId = source.CategoriaId,
                Eliminada = source.Eliminada,
                Nombre = source.Nombre,
                Color = source.Color,
                Emoji = source.Emoji,
                TipoEntrada = source.TipoEntrada,
                UsuarioID = source.UsuarioID
            };
        }

        public Categoria Map(CategoriaCreateDTO source)
        {
            return new Categoria {
                Nombre = source.Nombre,
                Color = source.Color,
                Emoji = source.Emoji,
                TipoEntrada = source.TipoEntrada
            };
        }
       
        public Categoria Map(Categoria result, CategoriaUpdateDTO categoriaDTO)
        {
            result.TipoEntrada = categoriaDTO.TipoEntrada;
            result.Nombre = categoriaDTO.Nombre;
            result.Color = categoriaDTO.Color;
            result.Emoji = categoriaDTO.Emoji;
            return result;
        }
      
    }
}