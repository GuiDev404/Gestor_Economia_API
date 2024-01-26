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
                    Nombre = categoria.Nombre
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
            };
        }

        public Categoria Map(CategoriaCreateDTO source)
        {
            return new Categoria {
                Nombre = source.Nombre,
            };
        }
    }
}