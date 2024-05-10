using System.Globalization;
using GestorEconomico.API.Data;
using GestorEconomico.API.DTOs;
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
                .Include(e=> e.Cuenta)
                .Include(e=> e.Categoria)
                .FirstOrDefaultAsync(e=> e.EntradaId == id);
        }

        public async Task<PaginationEntradasDTO<Entrada>> GetEntradas(QueryObject query, string? userId)
        {
            IQueryable<Entrada> entradas = _context.Entradas
                .Include(e=> e.Categoria)
                .Include(e=> e.Cuenta)
                .Where(e=> e.UsuarioID == userId);

            if(query.DateInit.HasValue && query.DateEnd.HasValue){
                entradas = entradas.Where(e => 
                    e.FechaInicio.Date >= query.DateInit.Value.Date &&
                    e.FechaInicio.Date <= query.DateEnd.Value.Date
                );
            }

            if(query.SortBy != null){
                if(query.SortBy.Equals("FechaInicio", StringComparison.OrdinalIgnoreCase)){
                    entradas = query.IsDescending 
                        ? entradas.OrderByDescending(c=> c.FechaInicio.Day)
                        : entradas.OrderBy(c=> c.FechaInicio.Day);
                }
            }

            var page = query.PageNumber - 1;
            var skipNumber = page * query.PageSize;
            var entradasList = await entradas
                .Skip(skipNumber)
                .Take(query.PageSize)
                .ToListAsync();

            decimal limit = entradasList.Count == 0 ? 1 : Convert.ToDecimal(entradasList.Count) / query.PageSize;

            return new PaginationEntradasDTO<Entrada> {
                Page = query.PageNumber,
                NextPage = query.PageNumber + 1,
                LimitPages = Math.Ceiling(limit),
                Results = entradas.ToList()
            };
        }

        public async Task<bool> Save()
        {
            try {
                return await _context.SaveChangesAsync() > 0;
            } catch (System.Exception) {
                return false;
            }
        }

        public Task<bool> UpdateEntrada(Entrada entradaActualizada)
        {
            _context.Update(entradaActualizada);
            return Save();
        }
    }
}