using GestorEconomico.API.Data;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.API.Repository
{
    public class CategoriaRepository: ICategoriaRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IEntradaRepository _entradaRepository;  

        public CategoriaRepository(ApplicationDbContext context, IEntradaRepository entradaRepository)
        {
            _context = context;
            _entradaRepository = entradaRepository;
        }

        public async Task<bool> CreateCategoria(Categoria categoria)
        {
            await _context.Categorias.AddAsync(categoria);
            return await Save();
        }

        public async Task<bool> DeleteCategoria(Categoria categoria)
        {
            // _context.Categorias.Remove(categoria);

            if(categoria.Eliminada){
                categoria.Eliminada = false;
                return await Save();
            } else {
                bool existeEnEntrada = await ExistCategoriaInEntrada(categoria.CategoriaId);
                
                if(existeEnEntrada) return false;

                categoria.Eliminada = true;
                return await Save();
            }

        }

        public Task<bool> ExistCategoriaInEntrada (int idCategory){
            var entradas =  _context.Entradas.ToList();
            bool existeEnEntrada = entradas.Any(entrada=> entrada.CategoriaId == idCategory);
            return Task.FromResult(existeEnEntrada);
        }

        public async Task<bool> ExistCategoria(int id)
        {
            return await _context.Categorias.AnyAsync(c=> c.CategoriaId == id);
        }

        public async Task<Categoria?> GetCategoriaById(int id)
        {
            return await _context.Categorias.FindAsync(id);
        }

        public async Task<IEnumerable<Categoria>> GetCategorias(QueryObject query)
        {
            IQueryable<Categoria> categorias = _context.Categorias;

            if(query.SortBy != null){
                if(query.SortBy.Equals("Nombre", StringComparison.OrdinalIgnoreCase)){
                    categorias = query.IsDescending     
                        ? categorias.OrderByDescending(c=> c.Nombre)
                        : categorias.OrderBy(c=> c.Nombre);
                }
            }

            return await categorias.ToListAsync();
        }

        public async Task<bool> Save()
        {
            try {
                return await _context.SaveChangesAsync() > 0;
            } catch (System.Exception) {
                return false;
            }
        }

        public Task<bool> UpdateCategoria(Categoria categoria)
        {
            _context.Update(categoria);
            return Save();
        }
    }
}