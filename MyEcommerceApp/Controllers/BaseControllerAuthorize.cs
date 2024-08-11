using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace MyEcommerceApp.Controllers
{
    [Authorize]
    public class BaseControllerAuthorize : ControllerBase
    {
        protected int UserId
        {
            get
            {
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                {
                    throw new Exception("Failed to get UserId from token");
                }
                return int.Parse(userIdClaim.Value);
            }
        }
    }
}
