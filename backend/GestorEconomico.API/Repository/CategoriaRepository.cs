using System.Collections;
using GestorEconomico.API.Data;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.API.Repository
{
    public class CategoriaRepository: ICategoriaRepository
    {
        private readonly ApplicationDbContext _context;
        // private readonly IEntradaRepository _entradaRepository;  
        private readonly UserManager<ApplicationUser> _userManager;  

        public CategoriaRepository(ApplicationDbContext context, IEntradaRepository entradaRepository, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            // _entradaRepository = entradaRepository;
            _userManager = userManager;
        }

        public async Task<IEnumerable<Entrada>?> GetEntradasByCategoria(int idCategory, string? userId){
            return _context.Entradas
                .Where(e=> e.CategoriaId == idCategory && (e.UsuarioID == userId || e.UsuarioID == ""))
                .AsEnumerable();
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

        public async Task<bool> ExistCategoria(int id, string? userId)
        {
            if(userId == null) return false;

            var usuarioActual = await _userManager.FindByIdAsync(userId);
            if(usuarioActual == null) return false;

            return await _context.Categorias
                .AnyAsync(c=> c.CategoriaId == id && c.UsuarioID == usuarioActual.Id);
        }

        public async Task<Categoria?> GetCategoriaById(int id)
        {
            return await _context.Categorias.FindAsync(id);
        }

        public async Task<IEnumerable<Categoria>> GetCategorias(QueryObject query, string userId)
        {
            IQueryable<Categoria> categorias = _context.Categorias
                .Where(c=> c.UsuarioID == userId || c.UsuarioID == "");

            if(query.SortBy != null){
                if(query.SortBy.Equals("Nombre", StringComparison.OrdinalIgnoreCase)){
                    categorias = query.IsDescending     
                        ? categorias.OrderByDescending(c=> c.Nombre)
                        : categorias.OrderBy(c=> c.Nombre);
                }
            }
            

            return await categorias.ToListAsync();
        }

        public Task<bool> UpdateCategoria(Categoria categoria)
        {
            _context.Update(categoria);
            return Save();
        }
        
        public async Task<bool> Save()
        {
            try {
                return await _context.SaveChangesAsync() > 0;
            } catch (System.Exception) {
                return false;
            }
        }

    }
}