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

            List<(string, string)> errors = new(); 

            if (cuenta == null) {
                errors.Add(("", "No se encontro la categoria"));

                return HandleErrors.ErrorAPI("Not Found", errors, 404);
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
                .Where(c => 
                    c.UsuarioID == userId &&
                    c.Titulo.Trim().ToLower() == cuentaCreateDTO.Titulo.Trim().ToLower())
                .FirstOrDefault();

            List<(string, string)> errors = new(); 

            if(cuentaExistente != null)  {
                errors.Add(("", "Esta cuenta ya fue creada"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }

            Cuenta nuevaCuenta = _mapper.Map(cuentaCreateDTO); 
            nuevaCuenta.UsuarioID = userId!;
            bool createdResult = await _cuentaRepository
                .CreateCuenta(nuevaCuenta);
            
            CuentaDTO nuevaCuentaDTO = _mapper.Map(nuevaCuenta); 
            
            if(!createdResult){
                errors.Add(("", "Lo sentimos, no se pudo guardar la cuenta"));
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
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
            // if (cuentaDTO == null) {
            //     ModelState.AddModelError(string.Empty, "Una cuenta es requerida");
            //     return BadRequest(ModelState);
            // }
            var queryParams = new QueryObject();
            List<(string, string)> errors = new (); 

            string? userId = GetCurrentUserId();

            if (id != cuentaDTO.CuentaId || string.IsNullOrEmpty(userId)) {
                errors.Add(("", "No se encontro la cuenta"));
                return HandleErrors.ErrorAPI("Bad Request", errors, 400);
            }

            Cuenta? cuentaExistente = await _cuentaRepository.GetCuentaById(id);
            if (cuentaExistente == null || cuentaExistente.UsuarioID != userId) {
                errors.Add(("", "No se encontro la cuenta"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }

            var categorias = await _cuentaRepository.GetCuentas(queryParams, userId!);
            
            Cuenta? cuentaExistante = categorias
                .Where(c => 
                    c.CuentaId != id &&
                    c.UsuarioID == userId &&
                    c.Titulo.Trim().ToLower() == cuentaDTO.Titulo.Trim().ToLower()
                )
                .FirstOrDefault();

            if(cuentaExistante != null)  {
                errors.Add(("", "La cuenta ya existe"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }
  
            Cuenta cuentaActualizada = _mapper.Map(cuentaExistente, cuentaDTO);

            bool updatedResult = await _cuentaRepository.UpdateCuenta(cuentaActualizada);
            if(!updatedResult){
                errors.Add(("", "Lo sentimos, no se pudo actualizar la cuenta"));
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            return Ok(cuentaActualizada);
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
            List<(string, string)> errors = new ();
            
            bool cuentaExistente = await _cuentaRepository.ExistCuenta(id, userId);
            if (!cuentaExistente) {
                errors.Add(("", "No se encontra la cuenta"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }
            
            Cuenta? cuenta = await _cuentaRepository.GetCuentaById(id);
            if(cuenta == null){
                errors.Add(("", "No se encontra la cuenta"));
                return HandleErrors.ErrorAPI("Not Found", errors, 404);
            }

            bool existeEnEntrada = await _cuentaRepository.ExistCuentaInEntrada(cuenta.CuentaId, cuenta.UsuarioID);
                
            if(existeEnEntrada){
                errors.Add(("", "La cuenta existe en una entrada, elimine primero esta"));
                return HandleErrors.ErrorAPI("Conflict", errors, 409);
            }

            bool deletedResult = await _cuentaRepository.DeleteCuenta(cuenta);
           
            if(!deletedResult){
                return HandleErrors.ErrorAPI("Internal Server Error", errors, 500);
            }

            return NoContent();
        }
    }
}