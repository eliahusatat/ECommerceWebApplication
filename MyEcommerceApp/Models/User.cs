
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyEcommerceApp.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public ICollection<Order> Orders { get; set; }

        public User()
        {
            if (UserName == null)
            {
                UserName = "";
            }
            if (Email == null)
            {
                Email = "";
            }
            if (Password == null)
            {
                Password = "";
            }
            if (Orders == null)
            {
                Orders = [];
            }
        }
    }
}
