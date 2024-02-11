namespace GaiaMetrics.Services
{
    public interface ICryptographyService
    {
        string ComputeSha256Hash(string rawData);
    }
}