namespace GaiaMetrics.Models.Response
{
    public class RoleGetResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<string> Claims { get; set; } = new List<string>();
    }
}
