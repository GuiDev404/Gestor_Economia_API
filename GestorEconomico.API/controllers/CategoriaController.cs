using Microsoft.AspNetCore.Mvc;
using GestorEconomico.API.Models;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using Microsoft.AspNetCore.Authorization;

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

        // GET: api/Categoria
        [HttpGet]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CategoriaDTO>))]
        public async Task<ActionResult> GetCategoria([FromQuery] string? search)
        {
            IEnumerable<Categoria> categorias = await _categoriaRepository.GetCategorias(search);
            IEnumerable<CategoriaDTO> categoriasDTO = _mapper.Map(categorias);

            return Ok(categoriasDTO);
        }

        // GET: api/Categoria/5
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(CategoriaDTO))]
        public async Task<ActionResult> GetCategoria(int id)
        {
            var categoria = await _categoriaRepository.GetCategoriaById(id);

            if (categoria == null) {
                return NotFound(new ProblemDetails {
                    Title = "No se encontro la categoria"
                });
            }

            CategoriaDTO categoriaDTO = _mapper.Map(categoria);
            
            return Ok(categoriaDTO);
        }

        // PUT: api/Categoria/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutCategoria(int id, [FromBody] CategoriaDTO categoriaDTO)
        {
            if (categoriaDTO == null)
            {
                ModelState.AddModelError("", "Una categoria es requerida");
                return BadRequest(ModelState);
            }

            ProblemDetails notFound = new () {
                Title = "No se encontro esa categoria"
            };
            
            if (id != categoriaDTO.CategoriaId)
            {
                return BadRequest(notFound);
            }

            bool categoriaExistente = await _categoriaRepository.ExistCategoria(id);
            if (!categoriaExistente) {
                return NotFound(notFound);
            }
  
            Categoria categoriasUpdated = _mapper.Map(categoriaDTO);

            // if (!ModelState.IsValid)
            //     return BadRequest();

            bool updatedResult = await _categoriaRepository.UpdateCategoria(categoriasUpdated);
            if(!updatedResult){
                ModelState.AddModelError("", "Algo salio mal actualizando la categoria");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        // POST: api/Categoria
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(201, Type = typeof(CategoriaDTO))]
        [ProducesResponseType(409, Type = typeof(ProblemDetails))]
        public async Task<ActionResult> PostCategoria(CategoriaCreateDTO categoria)
        {
            var categorias = await _categoriaRepository.GetCategorias();
            Categoria? categoriaExistente = categorias
                .Where(c => c.Nombre.Trim().ToUpper() == categoria.Nombre.Trim().ToUpper())
                .FirstOrDefault();

            if(categoriaExistente != null)  {
                return StatusCode(409, new ProblemDetails {
                    Title = "Categoria existente"
                });
            }

            Categoria nuevaCategoria = _mapper.Map(categoria); 
            bool createdResult = await _categoriaRepository.CreateCategoria(nuevaCategoria);
            
            CategoriaDTO nuevaCategoriaDTO = _mapper.Map(nuevaCategoria); 
            
            if(!createdResult){
                ModelState.AddModelError("", "Algo salio mal guardando la categoria");
                return StatusCode(500, ModelState);
            }

            return CreatedAtAction(
                nameof(GetCategoria),
                new { id = nuevaCategoria.CategoriaId },
                nuevaCategoriaDTO
            );
        }

        // DELETE: api/Categoria/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            Categoria? categoria = await _categoriaRepository.GetCategoriaById(id);
            if (categoria == null) {
                return NotFound();
            }

            bool deletedResult = await _categoriaRepository.DeleteCategoria(categoria);
           
            if(!deletedResult){
                ModelState.AddModelError("", "Algo salio mal al eliminar la categoria");
            }

            return NoContent();
        }

    }
}
