namespace GaiaMetrics.Models.Response
{
    public class ErrorResponse
    {
        public ErrorResponse(string key, string message)
        {
            Key = key;
            Message = message;
        }

        public string Key { get; set; }
        public string Message { get; set; }
    }
}
