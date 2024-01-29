using System.Security.Claims;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GestorEconomico.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly ITokenServices _tokenServices;

        public AuthController(IAuthRepository authRepository, ITokenServices tokenServices)
        {
            _authRepository = authRepository;
            _tokenServices = tokenServices;
        }

        [HttpGet("CurrentUser")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(UsuarioRolesDTO))]
        public async Task<ActionResult> GetCurrentUser (){
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if(identity == null) return Unauthorized("Usuario no autenticado");

            string? userId = identity.Claims
                .FirstOrDefault(c=> c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized("Usuario no autenticado correctamente");

            UsuarioRolesDTO usuario = await _authRepository.GetCurrentUser(userId);

            if (usuario == null)  return NotFound("Usuario no encontrado");

            return Ok(usuario);
        }

        [HttpPost("Register")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<ActionResult> Register (RegisterUserDTO registerUserDTO){
            string USUARIO_ROLE_NAME = "Usuario";
            IdentityRole role = await _authRepository.GetRoleByName(USUARIO_ROLE_NAME);
            
            if(role == null) return BadRequest("Rol faltante comuniquese con el administrador!");

            bool existUser = await _authRepository.ExistUser(registerUserDTO.Correo);

            // validaciones de correo, y contraseña, confirmar contraseña

            if (!existUser) {
                bool resultado = await _authRepository
                    .CreateUser(registerUserDTO.Correo, registerUserDTO.Contraseña, role.Name);
            
                return resultado 
                    ? Created("", "Usuario creado correctamente")
                    : BadRequest("Lo sentimos no se pudo crear el usuario");
            } else {
                ModelState
                    .AddModelError(
                        "Resumen",
                        "Lo sentimos ya existe un usuario con ese correo o nombre de usuario"
                    ); 
                return Conflict(ModelState);
            }
        }


        [HttpPost("Login")]
        public async Task<ActionResult> Login (LoginUserDTO loginUserDTO){
            var usuario = await _authRepository.GetUserByEmail(loginUserDTO.Correo);

            if(usuario == null) return Unauthorized("El usuario no existe");

            var contraseñaValida = await _authRepository.IsCorrectPassword(usuario, loginUserDTO.Contraseña);
            if (!contraseñaValida) return Unauthorized("La contraseña no coincide.");
            
            var roles = await _authRepository.GetUserRoles(usuario);
            UsuarioRolesDTO usuarioConRol = new () {
                Usuario = usuario,
                Roles = roles
            };

            var creationTokensResult = await _authRepository.CreationTokens(usuarioConRol);

            if(!creationTokensResult.savedSuccess) {
                ModelState.AddModelError("", "Algo salio mal actualizando la categoria");
                return StatusCode(500, ModelState);
            } 

            var response = new {
                creationTokensResult.accessToken,
                creationTokensResult.refreshToken,
                rol = usuarioConRol.Roles[0],
                userId = usuarioConRol.Usuario.Id
            };

            return Ok(response);
        }


        [HttpPost("Refresh")]
        public async Task<IActionResult> RefreshToken(TokensDTO tokens) 
        {
            if (string.IsNullOrEmpty(tokens.RefreshToken)) return Unauthorized("Refresh token no encontrado");
            
            ApplicationUser usuario = await _authRepository.GetUserByRefreshToken(tokens.RefreshToken);

            if (usuario == null) return Unauthorized("Refresh token invalido");
            
            var roles = await _authRepository.GetUserRoles(usuario);
            UsuarioRolesDTO usuarioConRol = new (){
                Usuario = usuario,
                Roles = roles
            };

            var creationTokensResult = await _authRepository.CreationTokens(usuarioConRol);

            if(!creationTokensResult.savedSuccess) {
                ModelState.AddModelError("", "Algo salio mal actualizando la categoria");
                return StatusCode(500, ModelState);
            } 

            return Ok(new { creationTokensResult.accessToken, creationTokensResult.refreshToken });
        }
        }


}