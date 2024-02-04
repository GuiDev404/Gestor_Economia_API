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
    public class CuentaController : ControllerBase
    {
        private readonly ICuentaRepository _cuentaRepository;
        private readonly ICuentaMapper _mapper;

        public CuentaController(ICuentaRepository cuentaRepository, ICuentaMapper mapper)
        {   
            _cuentaRepository = cuentaRepository;
            _mapper = mapper;
        }

        private string? GetCurrentUserId (){
            string? userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        // GET: api/Cuentas
        [HttpGet]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CuentaDTO>))]
        public async Task<ActionResult> GetCuentas([FromQuery] QueryObject query)
        {
            IEnumerable<Cuenta> cuentas = await _cuentaRepository.GetCuentas(query, GetCurrentUserId());
            IEnumerable<CuentaDTO> cuentasDTO = _mapper.Map(cuentas);

            return Ok(cuentasDTO);
        }

          // GET: api/Cuenta/5
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(CuentaDTO))]
        [ProducesResponseType(400)]
        public async Task<ActionResult> GetCuenta(int id)
        {
            // esto o podria hacer llamar ExistCuenta(id)
            var cuenta = await _cuentaRepository.GetCuentaById(id);

            if (cuenta == null) {
                return NotFound(HandleErrors.SetContext("Recurso no encontrado", "No se encontro la cuenta"));
            }

            CuentaDTO cuentaDTO = _mapper.Map(cuenta);
            
            return Ok(cuentaDTO);
        }


        
        // POST: api/Cuenta
        [HttpPost]
        [Authorize]
        [ProducesResponseType(201, Type = typeof(CuentaDTO))]
        [ProducesResponseType(409, Type = typeof(ProblemDetails))]
        public async Task<ActionResult> CreateCuenta(CuentaCreateDTO cuentaCreateDTO)
        {
            string? userId = GetCurrentUserId();
            var queryParams = new QueryObject();

            var cuentas = await _cuentaRepository.GetCuentas(queryParams, userId!);
            Cuenta? cuentaExistente = cuentas
                .Where(c => c.Titulo.Trim().ToLower() == cuentaCreateDTO.Titulo.Trim().ToLower())
                .FirstOrDefault();

            if(cuentaExistente != null)  {
                return StatusCode(409, HandleErrors.SetContext("Cuenta existente", "Esta cuenta ya fue creada"));
            }

            Cuenta nuevaCuenta = _mapper.Map(cuentaCreateDTO); 
            nuevaCuenta.UsuarioID = userId!;
            bool createdResult = await _cuentaRepository
                .CreateCuenta(nuevaCuenta);
            
            CuentaDTO nuevaCuentaDTO = _mapper.Map(nuevaCuenta); 
            
            if(!createdResult){
                ModelState.AddModelError("", "Algo salio mal guardando la cuenta");
                return StatusCode(500, ModelState);
            }

            return CreatedAtAction(
                nameof(CreateCuenta),
                new { id = nuevaCuenta.CuentaId },
                nuevaCuentaDTO
            );
        }


        // PUT: api/Cuenta/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateCuenta(int id, [FromBody] CuentaUpdateDTO cuentaDTO)
        {
            if (cuentaDTO == null) {
                ModelState.AddModelError(string.Empty, "Una cuenta es requerida");
                return BadRequest(ModelState);
            }

            string? userId = GetCurrentUserId();

            if (id != cuentaDTO.CuentaId || string.IsNullOrEmpty(userId)) {
                return NotFound(HandleErrors.SetContext("No se encontro la cuenta "));
            }

            Cuenta? cuentaExistente = await _cuentaRepository.GetCuentaById(id);
            if (cuentaExistente == null || cuentaExistente.UsuarioID != userId) {
                return NotFound(HandleErrors.SetContext("No se encontro la cuenta"));
            }
  
            Cuenta cuentaActualizada = _mapper.Map(cuentaExistente, cuentaDTO);

            bool updatedResult = await _cuentaRepository.UpdateCuenta(cuentaActualizada);
            if(!updatedResult){
                ModelState.AddModelError(string.Empty, "Algo salio mal actualizando la cuenta");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }


        // DELETE: api/Cuenta/5
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCuenta(int id)
        {
            string? userId = GetCurrentUserId();
            
            bool cuentaExistente = await _cuentaRepository.ExistCuenta(id, userId);
            if (!cuentaExistente) {
                return NotFound(HandleErrors.SetContext("No se encontra la cuenta"));
            }

            if (string.IsNullOrEmpty(userId)) {
                return Unauthorized(HandleErrors.SetContext("No autorizado para eliminar esta cuenta"));
            }
            
            Cuenta? cuenta = await _cuentaRepository.GetCuentaById(id);

            bool deletedResult = await _cuentaRepository.DeleteCuenta(cuenta);
           
            if(!deletedResult){
                ModelState.AddModelError(string.Empty, "Algo salio mal al eliminar la cuenta");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}