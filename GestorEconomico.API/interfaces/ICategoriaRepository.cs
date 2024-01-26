using GestorEconomico.API.Models;

namespace GestorEconomico.API.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetCategorias(string? search  = null);
        // IEnumerable<Entrada> GetEntradasByCategory(int categoriaId);
        Task<Categoria?> GetCategoriaById(int id);
        Task<bool> ExistCategoria (int id);
        Task<bool> CreateCategoria (Categoria categoria);
        Task<bool> UpdateCategoria (Categoria categoria);
        Task<bool> DeleteCategoria (Categoria categoria);
        Task<bool> Save ();
    }
}