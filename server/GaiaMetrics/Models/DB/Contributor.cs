using System.ComponentModel.DataAnnotations;

namespace GaiaMetrics.Models.DB
{
    public class Contributor
    {
        public int Id { get; set; }
        [Required]
        public double Balance { get; set; }
        [Required]
        public bool IsTrusted { get; set; }

        //Optional 1:1
        public int? UserId { get; set; }
        public User? User { get; set; }
    }
}
