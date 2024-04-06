using System.Security.Claims;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using GestorEconomico.API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorEconomico.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntradaController : ControllerBase
    {
        private readonly IEntradaRepository _entradaRepository;
        private readonly IEntradaMapper _mapper;

        public EntradaController(IEntradaRepository entradaRepository, IEntradaMapper mapper)
        {
            _entradaRepository = entradaRepository;
            _mapper = mapper;
        }

        private string? GetCurrentUserId (){
            string? userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        // GET: api/Entrada
        [HttpGet]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(PaginationEntradasDTO<EntradaDTO>))]
        public async Task<ActionResult<PaginationEntradasDTO<EntradaDTO>>> GetEntradas([FromQuery] QueryObject query)
        {
            PaginationEntradasDTO<Entrada> entradas = await _entradaRepository
                .GetEntradas(query, GetCurrentUserId());
            IEnumerable<EntradaDTO> entradasDTO = _mapper.Map(entradas.Results);

            var paginationDTO = new PaginationEntradasDTO<EntradaDTO> (){
                LimitPages = entradas.LimitPages,
                Page = entradas.Page,
                NextPage = entradas.NextPage,
                Results = entradasDTO,
            };

            return Ok(paginationDTO);
        }

        // GET: api/Entrada/5
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(EntradaDTO))]
        public async Task<ActionResult<EntradaDTO>> GetEntrada(int id)
        {
            var entrada = await _entradaRepository.GetEntradaById(id);

            if (entrada == null) {
                return NotFound(HandleErrors.SetContext("No se encontro la entrada"));
            }

            EntradaDTO entradaDTO = _mapper.Map(entrada);
            return Ok(entradaDTO);
        }

        // POST: api/Entrada
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201, Type = typeof(EntradaDTO))]
        [ProducesResponseType(409, Type = typeof(ProblemDetails))]
        public async Task<ActionResult<EntradaDTO>> PostEntrada([FromForm] EntradaCreateDTO nuevaEntradaDTO)
        {
            string? userId = GetCurrentUserId();
            var queryObject = new QueryObject();

            var entradas = await _entradaRepository.GetEntradas(queryObject, userId);
            var entradaExistente = entradas.Results
                .Where(c => c.Descripcion.Trim().ToUpper() == nuevaEntradaDTO.Descripcion.Trim().ToUpper())
                .FirstOrDefault();

            if(entradaExistente != null)  {
                return StatusCode(409, HandleErrors.SetContext("Entrada existente") );
            }

            Entrada nuevaEntrada = _mapper.Map(nuevaEntradaDTO); 
            nuevaEntrada.UsuarioID = userId!;

            bool createdResult = await _entradaRepository.CreateEntrada(nuevaEntrada);

            if(!createdResult){
                ModelState.AddModelError("", "Algo salio mal guardando la entrada");
                return StatusCode(500, ModelState);
            }

            EntradaDTO entradaDTO = _mapper.Map(nuevaEntrada);
   
            return Created($"api/Entrada/{entradaDTO.CategoriaId}", entradaDTO);
        }


        // PUT: api/Categoria/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutCategoria(int id, [FromForm] EntradaUpdateDTO entradaUpdateDTO)
        {
            ProblemDetails notFound = new () {
                Title = "No se encontro esa entrada"
            };
            
            if (id != entradaUpdateDTO.EntradaId) {
                return BadRequest(notFound);
            }

            bool entradaExistente = await _entradaRepository.ExistEntrada(id);
            if (!entradaExistente) {
                return NotFound(notFound);
            }
  
            // SaveFile fileHelper = new ();
            // string[] mimetypes = new string[]{ "image/jpeg", "image/png", "image/tiff", "application/pdf" , "application/zip", "text/plain", "text/csv" };
            // Entrada entradaFile = fileHelper.FillFile(entradaUpdateDTO.Comprobante, new Entrada(), mimetypes);
            
            Entrada entradaUpdated = _mapper.Map(entradaUpdateDTO);

            bool updatedResult = await _entradaRepository.UpdateEntrada(entradaUpdated);
            if(!updatedResult){
                ModelState.AddModelError("", "Algo salio mal actualizando la entrada");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
     

        // DELETE: api/Categoria/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            Entrada? entrada = await _entradaRepository.GetEntradaById(id);
            if (entrada == null) {
                return NotFound(HandleErrors.SetContext("No se encontro esa entrada"));
            }

            bool deletedResult = await _entradaRepository.DeleteEntrada(entrada);
           
            if(!deletedResult){
                ModelState.AddModelError("", "Algo salio mal eliminando la entrada");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

    }
}