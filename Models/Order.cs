namespace CoffeeShop.Models
{
    public class Order
    {
        public int Id { get; set; }
        public double Tip { get; set; }
        public DateTime TimeOfPayment { get; set; }

        //Navigation properties
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
