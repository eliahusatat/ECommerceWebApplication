using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyEcommerceApp.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        public DateTime OrderDate { get; set; }

        [Required]
        public int UserId { get; set; }

        public int IsActive { get; set; }




    }
}
