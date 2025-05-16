namespace CoffeeShop.Models
{
    public class OrderItem
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
}
