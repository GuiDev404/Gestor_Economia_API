using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;

namespace GestorEconomico.API.Interfaces
{
    public interface ICuentaRepository
    {
        Task<IEnumerable<Cuenta>> GetCuentas(QueryObject query, string userId);
        Task<IEnumerable<Entrada>?> GetEntradasByCuentas(int idCuenta, string? userId);
        Task<Cuenta?> GetCuentaById(int id);
        Task<bool> ExistCuenta (int id, string? userId);
        Task<bool> ExistCuentaInEntrada (int idCuenta, string userId);
        Task<bool> CreateCuenta (Cuenta cuenta);
        Task<bool> UpdateCuenta (Cuenta cuenta);
        Task<bool> DeleteCuenta (Cuenta cuenta);
        Task<bool> Save ();
    }
}