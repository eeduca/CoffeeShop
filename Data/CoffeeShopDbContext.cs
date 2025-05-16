using Microsoft.EntityFrameworkCore;
using CoffeeShop.Models;

namespace CoffeeShop.Data
{
    public class CoffeeShopDbContext : DbContext
    {
        public CoffeeShopDbContext(DbContextOptions<CoffeeShopDbContext> options) : base(options) { }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Product> Products { get; set; }



        //protected override void OnModelCreating(ModelBuilder modelBuilder) 
                    ////No need for model builder because in class "Order" we made object from class "OrderItem",
                    ////and in class "OrderItem" we made object from classes "Order" and "Product".
                    ////That way we made relationship between the models, and we made foreign keys in database.
        //{
        //    modelBuilder.Entity<Order>()
        //        .HasMany(e => e.Items)
        //        .WithOne()
        //        .HasForeignKey(e => e.Order);

        //    modelBuilder.Entity<OrderItem>()
        //        .HasOne(e => e.Product)
        //        .WithMany();
        //}
    }
}
