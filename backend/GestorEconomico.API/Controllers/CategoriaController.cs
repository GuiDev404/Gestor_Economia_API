using Microsoft.AspNetCore.Mvc;
using GestorEconomico.API.Models;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using GestorEconomico.API.Utils;
using System.Security.Claims;
using System.Linq;

namespace GestorEconomico.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ICategoriaMapper _mapper;

        public CategoriaController(ICategoriaRepository categoriaRepository, ICategoriaMapper mapper )
        {
            _categoriaRepository = categoriaRepository;
            _mapper = mapper;
        }

        private string? GetCurrentUserId (){
            string? userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        // GET: api/Categoria
        [HttpGet]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CategoriaDTO>))]
        public async Task<ActionResult> GetCategorias([FromQuery] QueryObject query)
        {
            IEnumerable<Categoria> categorias = await _categoriaRepository.GetCategorias(query, GetCurrentUserId());
            IEnumerable<CategoriaDTO> categoriasDTO = _mapper.Map(categorias);

            return Ok(categoriasDTO);
        }

        // GET: api/Categoria/5
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(CategoriaDTO))]
        [ProducesResponseType(404)]
        public async Task<ActionResult> GetCategoria(int id)
        {
            // esto o podria hacer llamar ExistCategoria(id)
            var categoria = await _categoriaRepository.GetCategoriaById(id);

            List<(string, string)> errors = new(); 

            if (categoria == null) {
                errors.Add(("", "No se encontro la categoria"));
            }

            if (errors.Any())  {
                return HandleErrors.ErrorAPI("Not Found", errors, 404); 
            }

            CategoriaDTO categoriaDTO = _mapper.Map(categoria);
            
            return Ok(categoriaDTO);
        }

        // PUT: api/Categoria/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutCategoria(int id, [FromBody] CategoriaUpdateDTO categoriaDTO)
        {
            // if (categoriaDTO == null)
            // {
            //     ModelState.AddModelError("", "Una categoria es requerida");
            //     return BadRequest(ModelState);
            // }
            
            List<(string, string)> errors = new (); 

            string? userId = GetCurrentUserId();
            if (id != categoriaDTO.CategoriaId || string.IsNullOrEmpty(userId))
            {
                errors.Add(("", "No se encontro la categoria"));
                return HandleErrors.ErrorAPI("Bad Request", errors, 400);
            }

            Categoria? categoriaEncontrada = await _categoriaRepository.GetCategoriaById(id);
            if (categoriaEncontrada == null || categoriaEncontrada.UsuarioID != userId) {
                errors.Add(("", "No se encontro la categoria"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }

            var queryParams = new QueryObject();
            var categorias = await _categoriaRepository.GetCategorias(queryParams, userId!);
            
            Categoria? categoriaExistente = categorias
                .Where(c => 
                    c.CategoriaId != id &&
                    c.UsuarioID == userId &&
                    c.Nombre.Trim().ToUpper() == categoriaDTO.Nombre.Trim().ToUpper()
                )
                .FirstOrDefault();

            if(categoriaExistente != null)  {
                errors.Add(("", "La categoria ya existe"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }
  
            Categoria categoriasUpdated = _mapper.Map(categoriaEncontrada, categoriaDTO);

            bool updatedResult = await _categoriaRepository.UpdateCategoria(categoriasUpdated);
            if(!updatedResult){
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            return Ok(categoriasUpdated);
        }

        // POST: api/Categoria
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201, Type = typeof(CategoriaDTO))]
        [ProducesResponseType(409, Type = typeof(ProblemDetails))]
        public async Task<ActionResult> PostCategoria(CategoriaCreateDTO categoria)
        {
            string? userId = GetCurrentUserId();
            var queryParams = new QueryObject();
            var categorias = await _categoriaRepository.GetCategorias(queryParams, userId!);
            
            Categoria? categoriaExistente = categorias
                .Where(c => c.Nombre.Trim().ToUpper() == categoria.Nombre.Trim().ToUpper())
                .FirstOrDefault();

            List<(string, string)> errors = new ();
            if(categoriaExistente != null) {
                errors.Add(("", "La categoria ya existe"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }

            Categoria nuevaCategoria = _mapper.Map(categoria); 
            nuevaCategoria.UsuarioID = userId!;

            bool createdResult = await _categoriaRepository.CreateCategoria(nuevaCategoria);
            if(!createdResult){
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            CategoriaDTO nuevaCategoriaDTO = _mapper.Map(nuevaCategoria); 

            return CreatedAtAction(
                nameof(GetCategoria),
                new { id = nuevaCategoria.CategoriaId },
                nuevaCategoriaDTO
            );
        }

        // DELETE: api/Categoria/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            string userId = GetCurrentUserId();
            bool existCategoria = await _categoriaRepository.ExistCategoria(id, userId);
            
            List<(string, string)> errors = new ();

            if (!existCategoria) {
                errors.Add(("", "No se encontra la categoria"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }

            Categoria? categoria = await _categoriaRepository.GetCategoriaById(id);

            if(categoria == null || categoria.UsuarioID == ""){
                errors.Add(("", "No se encontra la categoria"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }

            bool deletedResult = await _categoriaRepository.DeleteCategoria(categoria);
           
            if(!deletedResult){
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            return NoContent();
        }

    }
}
