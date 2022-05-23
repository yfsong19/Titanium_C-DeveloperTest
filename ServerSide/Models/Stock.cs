using System.ComponentModel.DataAnnotations;

namespace Titanium.Models
{
    public class Stock
    {
        [Key]
        public int ProductId { get; set; }
        public string? Description { get; set; }
        public int CurrentStock { get; set; }
        public int SafeStock { get; set; }
        public decimal SoldStockTotal { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderStock
    {
        public int ProductId { get; set; }
        public string? Description { get; set; }
        public int ReOrderUnits { get; set; }
    }
}
