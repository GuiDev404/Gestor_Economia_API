using GestorEconomico.API.DTOs;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Interfaces
{
    public interface IEntradaRepository
    {
        Task<PaginationEntradasDTO<Entrada>> GetEntradas(QueryObject query, string? userId);
        Task<Entrada?> GetEntradaById(int id);
        Task<bool> ExistEntrada (int id);
        Task<bool> CreateEntrada (Entrada nuevaEntrada);
        Task<bool> UpdateEntrada (Entrada entradaActualizada);
        Task<bool> DeleteEntrada (Entrada entrada);
        Task<bool> Save();
    }
}