using Microsoft.AspNetCore.Mvc;
using GestorEconomico.API.Models;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using GestorEconomico.API.Utils;
using System.Security.Claims;

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
        [ProducesResponseType(400)]
        public async Task<ActionResult> GetCategoria(int id)
        {
            // esto o podria hacer llamar ExistCategoria(id)
            var categoria = await _categoriaRepository.GetCategoriaById(id);

            if (categoria == null) {
                return NotFound(HandleErrors.SetContext("No se encontro la categoria"));
            }

            CategoriaDTO categoriaDTO = _mapper.Map(categoria);
            
            return Ok(categoriaDTO);
        }

        // PUT: api/Categoria/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutCategoria(int id, [FromBody] CategoriaUpdateDTO categoriaDTO)
        {
            if (categoriaDTO == null)
            {
                ModelState.AddModelError("", "Una categoria es requerida");
                return BadRequest(ModelState);
            }
            
            string? userId = GetCurrentUserId();
            if (id != categoriaDTO.CategoriaId || string.IsNullOrEmpty(userId))
            {
                return BadRequest(HandleErrors.SetContext("No se encontro la categoria"));
            }

            Categoria? categoriaExistente = await _categoriaRepository.GetCategoriaById(id);
            if (categoriaExistente == null || categoriaExistente.UsuarioID != userId) {
                return NotFound(HandleErrors.SetContext("No se encontro la categoria"));
            }
  
            Categoria categoriasUpdated = _mapper.Map(categoriaExistente, categoriaDTO);

            bool updatedResult = await _categoriaRepository.UpdateCategoria(categoriasUpdated);
            if(!updatedResult){
                ModelState.AddModelError("", "Algo salio mal actualizando la categoria");
                return StatusCode(500, ModelState);
            }

            return NoContent();
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

            if(categoriaExistente != null)  {
                return StatusCode(409, HandleErrors.SetContext("La categoria ya existe"));
            }

            Categoria nuevaCategoria = _mapper.Map(categoria); 
            nuevaCategoria.UsuarioID = userId!;
            bool createdResult = await _categoriaRepository
                .CreateCategoria(nuevaCategoria);
            
            if(!createdResult){
                ModelState.AddModelError("", "Algo salio mal guardando la categoria");
                return StatusCode(500, ModelState);
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
            if (!existCategoria) {
                return NotFound("No se encontra la categoria");
            }

            Categoria? categoria = await _categoriaRepository.GetCategoriaById(id);

            if(categoria == null || categoria.UsuarioID == ""){
                return NotFound("No se encontra la categoria");
            }

            bool deletedResult = await _categoriaRepository.DeleteCategoria(categoria);
           
            if(!deletedResult){
                ModelState.AddModelError("", "Algo salio mal al eliminar la categoria");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

    }
}
