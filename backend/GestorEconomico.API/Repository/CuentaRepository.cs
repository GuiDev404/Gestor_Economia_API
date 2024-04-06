using GestorEconomico.API.Data;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.API.Repository
{
    public class CuentaRepository : ICuentaRepository
    {

        private readonly ApplicationDbContext _context;
        // private readonly IEntradaRepository _entradaRepository;  
        private readonly UserManager<ApplicationUser> _userManager;  

        public CuentaRepository(ApplicationDbContext context, IEntradaRepository entradaRepository, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            // _entradaRepository = entradaRepository;
            _userManager = userManager;
        }

        public async Task<bool> CreateCuenta(Cuenta cuenta)
        {
            await _context.Cuentas.AddAsync(cuenta);
            return await Save();
        }

        public async Task<bool> DeleteCuenta(Cuenta cuenta)
        {
            if(cuenta.Eliminada){
                cuenta.Eliminada = false;
                return await Save();
            } else {

                cuenta.Eliminada = true;
                return await Save();
            }
        }

        public async Task<bool> ExistCuentaInEntrada(int idCuenta, string userId)
        {
            bool existeEnEntrada = await _context.Entradas
                .AnyAsync(entrada=> entrada.CuentaId == idCuenta && entrada.UsuarioID == userId);
            return existeEnEntrada;
        }

        public async Task<bool> ExistCuenta(int id, string? userId)
        {
            if(string.IsNullOrEmpty(userId)) return false;

            // var usuarioActual = await _userManager.FindByIdAsync(userId);
            // if(usuarioActual == null) return false;

            return await _context.Cuentas
                .AnyAsync(c=> c.CuentaId == id && c.UsuarioID == userId);
        }

        public async Task<Cuenta?> GetCuentaById(int id)
        {
            return await _context.Cuentas.FindAsync(id);
        }

        public async Task<IEnumerable<Cuenta>> GetCuentas(QueryObject query, string userId)
        {
            IQueryable<Cuenta> cuentas = _context.Cuentas
                .Where(c=> c.UsuarioID == userId || c.UsuarioID == "");

            if(query.SortBy != null){
                if(query.SortBy.Equals("Titulo", StringComparison.OrdinalIgnoreCase)){
                    cuentas = query.IsDescending     
                        ? cuentas.OrderByDescending(c=> c.Titulo)
                        : cuentas.OrderBy(c=> c.Titulo);
                }
            }
            
            return await cuentas.ToListAsync();
        }

        public async Task<IEnumerable<Entrada>?> GetEntradasByCuentas(int idCuenta, string? userId)
        {
            return _context.Entradas
                .Where(e=> e.CuentaId == idCuenta && (e.UsuarioID == userId || e.UsuarioID == ""))
                .AsEnumerable();
        }

        public async Task<bool> Save()
        {
            try {
                return await _context.SaveChangesAsync() > 0;
            } catch (System.Exception) {
                return false;
            }
        }

        public Task<bool> UpdateCuenta(Cuenta cuenta)
        {
            _context.Update(cuenta);
            return Save();
        }
    }
}