using GestorEconomico.API.Data;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.API.Repository
{
    public class EntradaRepository : IEntradaRepository
    {
        private readonly ApplicationDbContext _context;  

        public EntradaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateEntrada(Entrada nuevaEntrada)
        {
            await _context.Entradas.AddAsync(nuevaEntrada);
            return await Save();
        }

        public async Task<bool> DeleteEntrada(Entrada entrada)
        {
            entrada.Eliminada = !entrada.Eliminada;
            return await UpdateEntrada(entrada);
        }

        public async Task<bool> ExistEntrada(int id)
        {
            return await _context.Entradas.AnyAsync(entrada=> entrada.EntradaId == id);
        }

        public async Task<Entrada?> GetEntradaById(int id)
        {
            return await _context.Entradas
                .Include(e=> e.Categoria)
                .FirstOrDefaultAsync(e=> e.EntradaId == id);
        }

        public async Task<IEnumerable<Entrada>> GetEntradas()
        {
            return await _context.Entradas
                .Include(e=> e.Categoria)
                .ToListAsync();
        }

        public async Task<bool> Save()
        {
            try {
                return await _context.SaveChangesAsync() > 0;
            } catch (System.Exception) {
                return false;
            }
        }

        public async Task<bool> UpdateEntrada(Entrada entradaActualizada)
        {
            _context.Entradas.Update(entradaActualizada);
            return await Save();
        }
    }
}