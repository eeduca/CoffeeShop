namespace CoffeeShop.Models
{
    public class Order
    {
        public int Id { get; set; }
        public double Tip { get; set; } = 0.00;
        public DateTime? TimeOfPayment { get; set; }
        public DateTime TimeCreated { get; set; } = DateTime.Now;
        public int TableNumber { get; set; } = 0;



        //Navigation properties
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
