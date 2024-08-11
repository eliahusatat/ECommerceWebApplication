using System.Threading.Tasks;
using MyEcommerceApp.DTOs;
using MyEcommerceApp.Models;

namespace MyEcommerceApp.Services
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(RegisterUserDto registerUser);
        Task<string> AuthenticateUserAsync(LoginUserDto loginUser);
    }
}
