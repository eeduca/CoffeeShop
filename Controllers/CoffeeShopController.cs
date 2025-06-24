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
    public class orderItemDto
    {
        public string ?Name { get; set; }
        public int TableNum { get; set; }
        public int ?ProductId { get; set; }

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

        [HttpGet("GetOrderItems/{tableNum}")]
        public async Task<IActionResult> GetOrderItems(int tableNum)
        {
            int orderId = GetOrderId(tableNum).Result; //??? da li treba da napisem await?

            var orderItems = await _context.OrderItems
                .Select(o => new {
                    o.ProductName,
                    o.UnitPrice,
                    o.OrderId
                })
                .Where(o => o.OrderId == orderId)//?? da li ce ovo (orderId.Result) vratiti int?
                .ToListAsync();
            return Ok(orderItems);

        }

        [HttpGet("GetOrder/{tableNum}")]
        public async Task<IActionResult> GetOrder(int tableNum)
        {
            var order = await _context.Orders
                .Select(o => new {
                    o.Id,
                    o.Tip,
                    o.TimeOfPayment,
                    o.TableNumber
                })
                .Where(o => o.TableNumber == tableNum)
                .ToListAsync();
            return Ok(order);

        }

        /// <summary>
        /// Method <c>GetOrderId</c> returns -1 if there is no order for specified table number.
        /// </summary>
        [HttpGet("GetOrderId/{tableNum}")]
        public async Task<int> GetOrderId(int tableNum) //kako da vratim int, a ne IActionResult?
        {
            var order = await _context.Orders
                .Select(o => new
                {
                    o.Id,
                    o.TableNumber,
                    o.TimeOfPayment
                })
                .FirstOrDefaultAsync(o => o.TableNumber == tableNum && o.TimeOfPayment == null);
            if (order == null) return -1; // Return -1 if no active order is found
            return order.Id;
        }

        [HttpPost("AddOrderItem")]
        public async Task<IActionResult> AddOrderItem([FromBody] orderItemDto addOrderItem)
        {
            var orderId = GetOrderId(addOrderItem.TableNum);
            if (orderId.Result == -1)
            {
                return BadRequest("No active order found for the specified table number.");
            }
            
            var productItem = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == addOrderItem.ProductId && p.IsActive);
            if (productItem== null)
            {
                return BadRequest("Product not found or is inactive.");
            }

            var newOrderItem = new OrderItem
            {
                ProductName = productItem.Name,
                UnitPrice = productItem.Price,
                OrderId = orderId.Result,
                ProductId = productItem.Id,
            };

            if (ModelState.IsValid)
            {
                _context.OrderItems.Add(newOrderItem);
                await _context.SaveChangesAsync();
                return Ok(newOrderItem);
    }
            return BadRequest("Invalid order item data.");
}

        [HttpDelete("RemoveOrderItem")]
        public async Task<IActionResult> RemoveOrderItem([FromBody] orderItemDto removeOrderItem)
        {
            var orderId = GetOrderId(removeOrderItem.TableNum);
            if (orderId.Result == -1)
            {
                return BadRequest("No active order found for the specified table number.");
            }

            var productItem = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == removeOrderItem.Name && p.IsActive);
            if (productItem == null)
            {
                return BadRequest("Product not found or is inactive.");
            }

            var item = await _context.OrderItems
                .Where(o => o.OrderId == orderId.Result && o.ProductId == productItem.Id)
                .FirstAsync();

            if (item != null)
            {
                _context.OrderItems.Remove(item);
                await _context.SaveChangesAsync();
            }
            return Ok();
            
        }

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
                .Select(o => new
                {
                    o.TableNumber,
                    o.TimeOfPayment
                })
                .Where(o => o.TableNumber == tableNum && o.TimeOfPayment == null)
                .AnyAsync();
            return Ok(isOccupied);
        }
    }
}
