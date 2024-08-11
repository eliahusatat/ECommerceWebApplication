using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyEcommerceApp.Data;
using MyEcommerceApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // Adds services required for using controllers in the application.

// Register the IUserService with the UserService implementation for dependency injection.
builder.Services.AddScoped<IUserService, UserService>();

// Configure the database context to use SQL Server with the connection string from configuration.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add support for API documentation generation using Swagger.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS (Cross-Origin Resource Sharing) policies.
builder.Services.AddCors((options) =>
{
    options.AddPolicy("DevCors", (corsBuilder) =>
    {
        corsBuilder.WithOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:8000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Allow specified origins in development environment.
    });
    options.AddPolicy("ProdCors", (corsBuilder) =>
    {
        corsBuilder.WithOrigins("https://myProductionSite.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Allow specified origins in production environment.
    });
});

// Retrieve the JWT secret key from the configuration.
string? tokenKeyString = builder.Configuration.GetSection("Jwt:Key").Value;

if (string.IsNullOrEmpty(tokenKeyString))
{
    throw new ArgumentNullException("TokenKey is missing in the configuration."); // Throw an error if the token key is missing.
}
var tokenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKeyString)); // Create a symmetric security key from the token key string.

var tokenValidationParameters = new TokenValidationParameters
{
    IssuerSigningKey = tokenKey,
    ValidateIssuerSigningKey = true,
    ValidateIssuer = false,
    ValidateAudience = false
};

// Configure JWT authentication with the token validation parameters.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = tokenValidationParameters;
    });

// Configure authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

var app = builder.Build(); // Build the application pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCors"); // Use development CORS policy.
    app.UseSwagger(); // Enable Swagger middleware for API documentation.
    app.UseSwaggerUI(); // Enable Swagger UI.
}
else
{
    app.UseCors("ProdCors"); // Use production CORS policy.
    app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS in production.
}

app.UseAuthentication(); // Enable authentication middleware.

app.UseAuthorization(); // Enable authorization middleware.

app.MapControllers(); // Map controller routes.

app.Run(); // Run the application.
