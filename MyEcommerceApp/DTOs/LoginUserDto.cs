using System.ComponentModel.DataAnnotations;

namespace MyEcommerceApp.DTOs
{
    public class LoginUserDto
    {
        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public LoginUserDto()
        {
            if (Email == null)
            {
                Email = "";
            }
            if (Password == null)
            {
                Password = "";
            }
        }
    }
}
