using System.ComponentModel.DataAnnotations;

namespace MyEcommerceApp.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        public RegisterUserDto()
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
        }
    }
}
