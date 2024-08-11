using System.Net;

namespace MyEcommerceApp.DTOs
{
    public class CustomResponse<T>
    {
        public HttpStatusCode Status { get; set; }
        public string Message { get; set; } = string.Empty; // Initialize Message to an empty string
        public T? Data { get; set; } = default!; // Initialize Data to the default value for T

        public CustomResponse() { }

        public CustomResponse(HttpStatusCode status, string message, T data)
        {
            Status = status;
            Message = message;
            Data = data;
        }
    }
}