using System.ComponentModel.DataAnnotations;

namespace MyEcommerceApp.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Stock { get; set; }

        public Product()
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
