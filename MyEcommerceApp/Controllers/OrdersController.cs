using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyEcommerceApp.Data;
using MyEcommerceApp.DTOs;
using MyEcommerceApp.Models;

namespace MyEcommerceApp.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : BaseControllerAuthorize
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrdersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpPost("AddItemToCart/{productId}")]
        public async Task<CustomResponse<string>> AddItemToCart(int productId)
        {
            // cart check
            Order? orderDb = await _context.Orders
                .Where(o => o.UserId == this.UserId && o.IsActive == 0)
                .FirstOrDefaultAsync<Order>();

            if (orderDb == null)
            {
                // If no inactive order (cart) exists, create a new one
                orderDb = new Order { UserId = this.UserId, IsActive = 0, };
                _context.Orders.Add(orderDb);
                if (await _context.SaveChangesAsync() < 1)
                {
                    return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "Fail to create cart", Data = "" };
                }
            }
            //product check
            Product? productDb = await _context.Products
                .Where(p => p.ProductId == productId)
                .FirstOrDefaultAsync<Product>();

            if (productDb == null) // if no such Product in the DB
            {
                return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "invalid item", Data = "" };
            }

            // Now insert a new order item with the found or newly created cart
            OrderItem orderItem = new OrderItem
            {
                OrderId = orderDb.OrderId,
                ProductId = productId,
            };

            _context.OrderItems.Add(orderItem);
            if (await _context.SaveChangesAsync() > 0)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.InternalServerError, Message = "Fail to add Item", Data = "" };
        }

        [HttpGet("GetItemsInTheCart")]
        public async Task<CustomResponse<IEnumerable<Product>>> GetItemsInTheCart()
        {
            Order? orderDb = await _context.Orders
                .Where(o => o.UserId == this.UserId && o.IsActive == 0)
                .FirstOrDefaultAsync<Order>();

            if (orderDb == null)
            {
                return new CustomResponse<IEnumerable<Product>> { Status = HttpStatusCode.OK, Message = "No cart found", Data = Enumerable.Empty<Product>() };
            }
            IEnumerable<Product> productsInCart = await (from oi in _context.OrderItems
                                                         join p in _context.Products
                                                         on oi.ProductId equals p.ProductId
                                                         where oi.OrderId == orderDb.OrderId
                                                         select p).ToListAsync();

            return new CustomResponse<IEnumerable<Product>> { Status = HttpStatusCode.OK, Message = "success", Data = productsInCart };
        }

        [HttpDelete("DeleteItemFromCart/{productId}")]
        public async Task<CustomResponse<string>> DeleteItemFromCart(int productId)
        {

            Order? orderDb = await _context.Orders
                .Where(o => o.UserId == this.UserId && o.IsActive == 0)
                .FirstOrDefaultAsync<Order>();

            if (orderDb == null)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.NotFound, Message = "No such item in the cart! (dont have cart at all)", Data = "" };
            }

            OrderItem? orderItemDb = _context.OrderItems
                .Where(o => o.ProductId == productId && o.OrderId == orderDb.OrderId)
                .FirstOrDefault<OrderItem>();

            if (orderItemDb != null)
            {
                _context.OrderItems.Remove(orderItemDb);
                if (await _context.SaveChangesAsync() > 0)
                {
                    return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = "" };
                }
                return new CustomResponse<string> { Status = HttpStatusCode.NotFound, Message = "Failed to Delete Item", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.NotFound, Message = "No such item in the cart!", Data = "" };
        }


        [HttpPost("CreateOrderFromCart")]
        public async Task<CustomResponse<string>> CreateOrderFromCart(int daysToAddToOrderDate)
        {
            // check if he have cart 
            Order? orderDb = await _context.Orders
                .Where(o => o.UserId == this.UserId && o.IsActive == 0)
                .FirstOrDefaultAsync<Order>();

            if (orderDb == null)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.NotFound, Message = "No cart found", Data = "" };
            }

            // Check if the order has at least one item
            bool hasItems = await _context.OrderItems
                .AnyAsync(oi => oi.OrderId == orderDb.OrderId);

            if (!hasItems)
            {
                return new CustomResponse<string>
                { Status = HttpStatusCode.NotFound, Message = "No items found in the cart", Data = string.Empty };
            }

            orderDb.IsActive = 1;
            orderDb.OrderDate = DateTime.Now.AddDays(daysToAddToOrderDate);
            if (await _context.SaveChangesAsync() > 0)
            {
                return new CustomResponse<string> { Status = HttpStatusCode.OK, Message = "success", Data = "" };
            }
            return new CustomResponse<string> { Status = HttpStatusCode.NotFound, Message = "Failed to create order", Data = "" };
        }

        [HttpGet("GetOrders")]
        public async Task<CustomResponse<IEnumerable<OrderItemWithProductDto>>> GetOrders()
        {
            var orderIds = await _context.Orders
                .Where(o => o.UserId == this.UserId && o.IsActive == 1)
                .Select(o => o.OrderId)
                .ToListAsync();

            IEnumerable<OrderItemWithProductDto> orderItemsWithProducts =
            await (from oi in _context.OrderItems
                   join p in _context.Products
                   on oi.ProductId equals p.ProductId
                   where orderIds.Contains(oi.OrderId)
                   select new OrderItemWithProductDto
                   {
                       OrderItemId = oi.OrderItemId,
                       OrderId = oi.OrderId,
                       ProductId = oi.ProductId,
                       Name = p.Name,
                       Description = p.Description,
                       Price = p.Price,
                       Stock = p.Stock
                   }).ToListAsync();
            return new CustomResponse<IEnumerable<OrderItemWithProductDto>> { Status = HttpStatusCode.OK, Message = "success", Data = orderItemsWithProducts };
        }

    }
}
