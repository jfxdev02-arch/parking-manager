using System.ComponentModel.DataAnnotations;

namespace ParkingManager.API.Models;

public class Vaga
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int Numero { get; set; } // 1 a 50
    
    [Required]
    [MaxLength(20)]
    public string Lado { get; set; } = "Esquerdo"; // "Esquerdo" | "Direito"
    
    public bool Ocupada { get; set; } = false;
    
    [MaxLength(100)]
    public string? QrCodeToken { get; set; } // token único imutável para QR Code
    
    // Navigation property
    public ICollection<Ocupacao> Ocupacoes { get; set; } = new List<Ocupacao>();
}
