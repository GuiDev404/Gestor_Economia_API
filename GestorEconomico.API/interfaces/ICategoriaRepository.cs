using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetCategorias(QueryObject query);
        
        Task<Categoria?> GetCategoriaById(int id);
        Task<bool> ExistCategoria (int id);
        Task<bool> ExistCategoriaInEntrada (int idCategory);
        Task<bool> CreateCategoria (Categoria categoria);
        Task<bool> UpdateCategoria (Categoria categoria);
        Task<bool> DeleteCategoria (Categoria categoria);
        Task<bool> Save ();
    }
}