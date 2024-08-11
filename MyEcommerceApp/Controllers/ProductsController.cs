using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerceApp.Data;
using MyEcommerceApp.DTOs;
using MyEcommerceApp.Models;
using MyEcommerceApp.Services;

namespace MyEcommerceApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        IMapper _mapper;

        public ProductsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _mapper = new Mapper(new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<ProductDto, Product>();
            }));
        }


        [HttpGet("GetProducts")]
        public async Task<CustomResponse<IEnumerable<Product>>> GetProducts()
        {
            IEnumerable<Product> products = await _context.Products.ToListAsync<Product>();
            return new CustomResponse<IEnumerable<Product>>
            {
                Status = HttpStatusCode.OK,
                Message = "success",
                Data = products
            };
        }

        [HttpGet("GetProductDetails/{productId}")]
        public async Task<CustomResponse<Product>> GetProductDetails(int productId)
        {
            Product? product = await _context.Products.Where(p => p.ProductId == productId)
            .FirstOrDefaultAsync<Product>();

            if (product != null)
            {
                return new CustomResponse<Product>
                {
                    Status = HttpStatusCode.OK,
                    Message = "success",
                    Data = product
                };
            }
            return new CustomResponse<Product>
            {
                Status = HttpStatusCode.NotFound,
                Message = "Failed to Get Product",
                Data = null
            };
        }

        [HttpPost("AddProduct")]
        [Authorize(Roles = "Admin")] // only req with role Admin in the jwt have access
        public async Task<CustomResponse<Product>> AddProduct(ProductDto productToAdd)
        {
            Product productDb = _mapper.Map<Product>(productToAdd);
            _context.Add(productDb);
            if (await _context.SaveChangesAsync() > 0)
            {
                Product? addedProduct = await _context.Products.OrderByDescending(p => p.ProductId).FirstOrDefaultAsync();
                // if(addedProduct == null){
                //     return new CustomResponse<Product> { Status = HttpStatusCode.InternalServerError, Message = "Failed to Add/find Product", Data = {} };
                // }
                return new CustomResponse<Product> { Status = HttpStatusCode.OK, Message = "success", Data = addedProduct };
            }
            return new CustomResponse<Product> { Status = HttpStatusCode.InternalServerError, Message = "Failed to Add Product", Data = { } };
        }

        [HttpPut("EditProduct")]
        [Authorize(Roles = "Admin")]
        public async Task<CustomResponse<string>> EditProduct(Product productToEdit)
        {
            Product? productDb = await _context.Products
                .Where(p => p.ProductId == productToEdit.ProductId)
                .FirstOrDefaultAsync<Product>();

            if (productDb != null)
            {
                productDb.Name = productToEdit.Name;
                productDb.Description = productToEdit.Description;
                productDb.Price = productToEdit.Price;
                productDb.Stock = productToEdit.Stock;
                if (await _context.SaveChangesAsync() > 0)
                {
                    return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = "" };
                }
                return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "Failed to Update Product", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "Failed to Get Product", Data = "" };
        }

        [HttpDelete("DeleteProduct/{productId}")]
        [Authorize(Roles = "Admin")]
        public async Task<CustomResponse<string>> DeleteProduct(int productId)
        {
            Product? productDb = await _context.Products
                .Where(p => p.ProductId == productId)
                .FirstOrDefaultAsync<Product>();

            if (productDb != null)
            {
                _context.Products.Remove(productDb);
                if (await _context.SaveChangesAsync() > 0)
                {
                    return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = "" };
                }
                return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "Failed to Delete User", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "Failed to Get Product", Data = "" };
        }
    }
}
