using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyEcommerceApp.Data;
using MyEcommerceApp.DTOs;
using MyEcommerceApp.Models;

namespace MyEcommerceApp.Services
{
    public class UserService : IUserService
    {
        // DB
        private readonly ApplicationDbContext _context;
        // 
        private readonly IConfiguration _configuration;

        // Constructor to inject the database context and configuration
        public UserService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Method to register a new user
        public async Task<bool> RegisterUserAsync(RegisterUserDto registerUser)
        {
            // Check if a user with the same email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerUser.Email))
            {
                return false; // User already exists
            }

            // Create a new user with hashed password
            var user = new User
            {
                UserName = registerUser.UserName,
                Email = registerUser.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerUser.Password)
            };

            // Add the new user to the database and save changes
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return true; // Registration successful
        }

        // Method to authenticate a user and generate a JWT token
        public async Task<string> AuthenticateUserAsync(LoginUserDto loginUser)
        {
            // Find the user by email
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == loginUser.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
            {
                return ""; // Authentication failed
            }
            string role = user.UserId == 1 ? "Admin" : "User";
            var tokenHandler = new JwtSecurityTokenHandler();

            // Retrieve the JWT key from the configuration
            var keyString = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                throw new ArgumentNullException("JWT Key is missing in the configuration."); // Throw an error if the key is missing
            }

            var key = Encoding.ASCII.GetBytes(keyString); // Convert the key to a byte array
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Create claims for the token
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("UserId", user.UserId.ToString()),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])), // Set token expiration
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) // Set signing credentials
            };

            var token = tokenHandler.CreateToken(tokenDescriptor); // Create the token
            return tokenHandler.WriteToken(token); // Return the token as a string
        }
    }
}
