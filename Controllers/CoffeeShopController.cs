using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CoffeeShop.Models;
using CoffeeShop.Data;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.Controllers
{
        public class OrderDto
    {
        public int Id { get; set; }
        public double Tip { get; set; }
        public DateTime TimeOfPayment { get; set; }

        //Navigation properties
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public bool IsActive { get; set; } = true;
        public string ImageFileName { get; set; }
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal TotPrice { get; set; }
        public string ProductName { get; set; } //From Product.Name
        public double UnitPrice { get; set; } //From Product.Price

        //Foreign key
        public Order Order { get; set; }
        public int OrderId { get; set; } //From Order.Id
        public Product Product { get; set; }
        public int ProductId { get; set; } //From Product.Id

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
        public IActionResult GetProducts()
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }
    }
}
