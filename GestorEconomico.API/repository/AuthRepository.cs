using GestorEconomico.API.Data;
using GestorEconomico.API.DTOs;
using GestorEconomico.API.Interfaces;
using GestorEconomico.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GestorEconomico.API.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _rolManager;
        private readonly ITokenServices _tokenServices;
        private readonly IConfiguration _config;

        public AuthRepository(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> rolManager, ITokenServices tokenServices, IConfiguration config)
        {
            _context = context;
            _userManager = userManager;
            _rolManager = rolManager;
            _tokenServices = tokenServices;
            _config = config;
        }

        public async Task<IdentityRole> GetRoleByName (string roleName)
        {
            IdentityRole rolDeUsuario = await _rolManager.FindByNameAsync(roleName);

            return rolDeUsuario;
        }

        public async Task<IList<string>> GetUserRoles (ApplicationUser user) {
            IList<string> userRoles = new List<string>();
            if(user != null){
                userRoles = await _userManager.GetRolesAsync(user);
            }
            return userRoles;
        }

        public async Task<ApplicationUser> GetUserByEmail (string email)
        {
            ApplicationUser? user = await _context.Users.SingleOrDefaultAsync(user=> user.Email == email);
           
            return user;
        }

        public async Task<ApplicationUser> GetUserByRefreshToken(string refreshToken)
        {
            ApplicationUser? user = await _context.Users
                .FirstOrDefaultAsync(user=> user.RefreshToken == refreshToken);
           
            return user;
        }

        public async  Task<bool> IsCorrectPassword (ApplicationUser usuario, string password)
        {
            return await _userManager.CheckPasswordAsync(usuario, password);
        }

        public async Task<bool> ExistUser (string email)
        {
            if(string.IsNullOrEmpty(email)) return false;

            return await _context.Users.AnyAsync(user=> user.Email == email);
        }

        public async Task<UsuarioRolesDTO> GetCurrentUser(string userId)
        {
            ApplicationUser? usuario = await _context.Users.FirstOrDefaultAsync(u=> u.Id == userId);

            if(usuario != null){
                var roles = await _userManager.GetRolesAsync(usuario);

                UsuarioRolesDTO usuarioRoles = new () {
                    Usuario = usuario,
                    Roles = roles
                };

                return usuarioRoles;
            }

            return null;
        }

        public async Task<dynamic> CreationTokens(UsuarioRolesDTO usuarioConRol)
        {
            var accessToken = _tokenServices.CreateAccessToken(usuarioConRol);
            var refreshToken = _tokenServices.CreateRefreshToken();

            usuarioConRol.Usuario.RefreshToken = refreshToken;
            bool result = await Save();
            return new {
                savedSuccess = result,
                accessToken,
                refreshToken,
            };
        }

        public async Task<bool> CreateUser(string email, string password, string rol)
        {
            var user = new ApplicationUser { 
                Email = email,
                UserName = email
            };

            try {
                var result = await _userManager.CreateAsync(user, password);

                await _userManager.AddToRoleAsync(user, rol);
                await Save();
                
                return result.Succeeded;
            } catch (Exception ex) {
                
                return false;
            }
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