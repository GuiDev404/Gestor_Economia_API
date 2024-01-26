using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace GestorEconomico.API.Services
{
    public class TokenServices : ITokenServices
    {
        private readonly IConfiguration _config;

        public TokenServices(IConfiguration config) {
            _config = config;
        }

        public string CreateAccessToken(UsuarioRolesDTO usuarioConRol)
        {
            var user = usuarioConRol.Usuario;
            // var rol = usuarioConRol.Roles.FirstOrDefault() ?? "";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Crear los claims
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                // new Claim(ClaimTypes.Name, user.UserName),
                // new Claim(ClaimTypes.Role, rol),
            };

            // Crear el token
            var accessTokenExpirationTime = _config["Jwt:AccessTokenExpirationMinutes"];
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(accessTokenExpirationTime)),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }

        public string CreateRefreshToken()
        {
            var randomNumber = new byte[32];
      
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}