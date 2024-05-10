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
        // [ProducesResponseType(409, Type = typeof(ProblemDetails))]
        public async Task<ActionResult<EntradaDTO>> PostEntrada([FromForm] EntradaCreateDTO nuevaEntradaDTO)
        {
            string? userId = GetCurrentUserId();
            var queryObject = new QueryObject();

            var entradas = await _entradaRepository.GetEntradas(queryObject, userId);
            var entradaExistente = entradas.Results
                .Where(e => 
                    e.UsuarioID == userId &&
                    e.Descripcion.Trim().ToUpper() == nuevaEntradaDTO.Descripcion.Trim().ToUpper()
                )
                .FirstOrDefault();

            List<(string, string)> errors = new(); 

            if(entradaExistente != null)  {
                errors.Add(("", "Esta entrada ya fue creada"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }

            Entrada nuevaEntrada = _mapper.Map(nuevaEntradaDTO); 
            if(userId != null){
                nuevaEntrada.UsuarioID = userId;
            };

            bool createdResult = await _entradaRepository.CreateEntrada(nuevaEntrada);

            if(!createdResult){
                errors.Add(("", "Lo sentimos, no se pudo guardar la entrada"));
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            EntradaDTO entradaDTO = _mapper.Map(nuevaEntrada);
   
            return Created($"api/Entrada/{entradaDTO.CategoriaId}", entradaDTO);
        }


        // PUT: api/Categoria/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutCategoria(int id, [FromForm] EntradaUpdateDTO entradaUpdateDTO)
        {
            List<(string, string)> errors = new(); 
            string? userId = GetCurrentUserId();
            
            if (id != entradaUpdateDTO.EntradaId || string.IsNullOrEmpty(userId)) {
                errors.Add(("", "Algo salio mal, no se encontro la entrada"));
                return HandleErrors.ErrorAPI("Bad Request", errors, 400);
            }

            Entrada? entradaEncontrada = await _entradaRepository.GetEntradaById(id);
            if (entradaEncontrada == null || entradaEncontrada?.UsuarioID != userId) {
                errors.Add(("", "No se encontro la entrada"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }
  
            // SaveFile fileHelper = new ();
            // string[] mimetypes = new string[]{ "image/jpeg", "image/png", "image/tiff", "application/pdf" , "application/zip", "text/plain", "text/csv" };
            // Entrada entradaFile = fileHelper.FillFile(entradaUpdateDTO.Comprobante, new Entrada(), mimetypes);
            
            var entradas = await _entradaRepository.GetEntradas(new QueryObject(), userId!);
            
            bool yaExiste = entradas.Results.Any(e => 
                e.Descripcion.Trim().ToLower() == entradaUpdateDTO.Descripcion.Trim().ToLower() &&
                e.FechaInicio == entradaUpdateDTO.FechaInicio &&
                e.EntradaId != id
            );

            if(yaExiste)  {
                errors.Add(("", "La entrada ya existe"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }
    
            Entrada entradaUpdated = _mapper.Map(entradaEncontrada, entradaUpdateDTO);
            // entradaUpdated.UsuarioID = userId;
            
            bool updatedResult = await _entradaRepository.UpdateEntrada(entradaUpdated);
            if(!updatedResult){
                errors.Add(("", "Algo salio mal vuelva a intentarlo en un rato"));
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            var dtoResult = _mapper.Map(entradaUpdated);
            return Ok(dtoResult);
        }
     

        // DELETE: api/Categoria/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            List<(string, string)> errors = new(); 

            Entrada? entrada = await _entradaRepository.GetEntradaById(id);
            if (entrada == null) {
                // return NotFound(HandleErrors.SetContext("No se encontro esa entrada"));
                errors.Add(("", "No se encontro esa entrada"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }

            bool deletedResult = await _entradaRepository.DeleteEntrada(entrada);
           
            if(!deletedResult){
                // ModelState.AddModelError("", "Algo salio mal eliminando la entrada");
                errors.Add(("", "Algo salio mal eliminando la entrada"));
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            return NoContent();
        }

    }
}