using GestorEconomico.API.Data;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;
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

        public async Task<IEnumerable<Entrada>> GetEntradas(QueryObject query)
        {
            IQueryable<Entrada> entradas = _context.Entradas.Include(e=> e.Categoria).AsQueryable();

            if(query.DateInit != null && query.DateEnd != null){
                entradas = entradas.Where(e=> e.FechaInicio >= query.DateInit && e.FechaFin <= query.DateEnd);
            }

            if(query.SortBy != null){
                if(query.SortBy.Equals("Monto", StringComparison.OrdinalIgnoreCase)){
                    entradas = query.IsDescending 
                        ? entradas.OrderByDescending(c=> c.Monto)
                        : entradas.OrderBy(c=> c.Monto);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;
            var entradasList = entradas
                .Skip(skipNumber)
                .Take(query.PageSize)
                .AsEnumerable();

            return entradasList;
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