using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CoffeeShop.Models;
using CoffeeShop.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoffeeShop.Controllers
{
    public class OrderDto
    {
        public int Id { get; set; }
        public double Tip { get; set; }
        public DateTime? TimeOfPayment { get; set; }
        public int TableNumber { get; set; }
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public bool IsActive { get; set; }
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal TotPrice { get; set; }
        public string ProductName { get; set; }
        public double UnitPrice { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }

    }

    [Route("api/[controller]")]
    [ApiController]
    public class CoffeeShopController : ControllerBase
    {
        public readonly CoffeeShopDbContext _context;
        public CoffeeShopController(CoffeeShopDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetProducts")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Where(p => p.IsActive)
                .ToListAsync();
            return Ok(products);
        }

        [HttpGet("GetOrderItems/{orderId}")]
        public async Task<IActionResult> GetOrderItems(int orderId)
        {
            var orderItems = await _context.OrderItems
                .Where(o => o.OrderId == orderId)
                .ToListAsync();
            return Ok(orderItems);

        }

        [HttpGet("GetOrderId/{tableNum}")]
        public async Task<ActionResult> GetOrderId(int tableNum)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.TableNumber == tableNum && o.TimeOfPayment == null);

            if (order == null) return Ok(); 

            return Ok(order.Id);
        }

        //[HttpPost]
        //public async Task<IActionResult> AddOrderItem([FromBody] OrderItem orderItem)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.OrderItems.Add(orderItem);
        //        await _context.SaveChangesAsync();
        //        return Ok(orderItem);
        //    }
        //    return BadRequest("Invalid order item data.");
        //}

        [HttpPost ("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto order)
        {
            var newOrder = new Order
            {
                TimeCreated = DateTime.Now,
                TableNumber = order.TableNumber,
                Tip = 0.00
            };

            if (ModelState.IsValid)
            {
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();
                return Ok(newOrder);
            }
            return BadRequest("Invalid order item data.");
        }

        [HttpGet("IsOccupied/{tableNum}")]
        public async Task<IActionResult> IsOccupied(int tableNum)
        {
            bool isOccupied = await _context.Orders
                .Where(o => o.TableNumber == tableNum && o.TimeOfPayment == null)
                .AnyAsync();
            return Ok(isOccupied);
        }
    }
}
