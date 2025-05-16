using CoffeeShop.Data;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<CoffeeShopDbContext> (options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnString")));
            var app = builder.Build();

            app.UseDefaultFiles();   // index.html
            app.UseStaticFiles();    // files from wwwroot

            app.Run();
        }
    }
}
