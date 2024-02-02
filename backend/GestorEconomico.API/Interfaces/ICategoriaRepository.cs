using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetCategorias(QueryObject query, string userId);
        Task<IEnumerable<Entrada>?> GetEntradasByCategoria(int idCategory, string? userId);
        Task<Categoria?> GetCategoriaById(int id);
        Task<bool> ExistCategoria (int id, string? userId);
        Task<bool> ExistCategoriaInEntrada (int idCategory);
        Task<bool> CreateCategoria (Categoria categoria);
        Task<bool> UpdateCategoria (Categoria categoria);
        Task<bool> DeleteCategoria (Categoria categoria);
        Task<bool> Save ();
    }
}