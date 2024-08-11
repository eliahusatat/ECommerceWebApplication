using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyEcommerceApp.DTOs;
using MyEcommerceApp.Models;
using MyEcommerceApp.Services;

namespace MyEcommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService) // IUserService get from DI of .NET cors
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<CustomResponse<string>> Register([FromBody] RegisterUserDto registerUserDto)
        {
            if (!ModelState.IsValid)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.BadRequest, Message = "Bad request", Data = ModelState.ToString() };
            }

            var result = await _userService.RegisterUserAsync(registerUserDto);

            if (!result)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.AlreadyReported, Message = "User already exists.", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = "" };
        }

        [HttpPost("login")]
        public async Task<CustomResponse<string>> Login([FromBody] LoginUserDto loginUserDto)
        {
            if (!ModelState.IsValid)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.BadRequest, Message = "Bad request", Data = ModelState.ToString() };
            }

            var token = await _userService.AuthenticateUserAsync(loginUserDto);

            if (token == "")
            {
                return new CustomResponse<string> { Status = HttpStatusCode.Unauthorized, Message = "Invalid credentials.", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = token };
        }
    }
}
