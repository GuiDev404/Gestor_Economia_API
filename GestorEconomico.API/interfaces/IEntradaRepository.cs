
using GestorEconomico.Models;

namespace GestorEconomico.interfaces
{
    public interface IEntradaRepository
    {
        Task<IEnumerable<Entrada>> GetEntradas();
        Task<Entrada?> GetEntradaById(int id);
        Task<bool> ExistEntrada (int id);
        Task<bool> CreateEntrada (Entrada nuevaEntrada);
        Task<bool> UpdateEntrada (Entrada entradaActualizada);
        Task<bool> DeleteEntrada (Entrada entrada);
        Task<bool> Save();
    }
}