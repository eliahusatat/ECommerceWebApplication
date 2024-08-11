using System.ComponentModel.DataAnnotations;

namespace MyEcommerceApp.DTOs
{
    public class OrderItemWithProductDto
    {
        public int OrderItemId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }

        public OrderItemWithProductDto()
        {
            if (Name == null)
            {
                Name = "";
            }
            if (Description == null)
            {
                Description = "";
            }
        }
    }
}
