using GestorEconomico.Data;
using GestorEconomico.interfaces;
using GestorEconomico.Models;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.repository
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
                IEnumerable<Entrada> entradas = await _entradaRepository.GetEntradas();
                Entrada? existeEnEntrada = entradas
                    .FirstOrDefault(entrada=> entrada.CategoriaId == categoria.CategoriaId);
                
                if(existeEnEntrada != null) return false;

                categoria.Eliminada = true;
                return await Save();
            }

        }

        public async Task<bool> ExistCategoria(int id)
        {
            return await _context.Categorias.AnyAsync(c=> c.CategoriaId == id);
        }

        public async Task<Categoria?> GetCategoriaById(int id)
        {
            return await _context.Categorias.FindAsync(id);
        }

        public async Task<IEnumerable<Categoria>> GetCategorias(string? search)
        {
            IQueryable<Categoria> categorias = _context.Categorias;

            if(!string.IsNullOrEmpty(search)){
                categorias = categorias.Where(c=> c.Nombre.Trim().ToLower().Contains(search.Trim().ToLower()));
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