using System.ComponentModel.DataAnnotations;

namespace ParkingManager.API.Models;

public class Ocupacao
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int VagaId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string NomeUsuario { get; set; } = string.Empty;
    
    [Required]
    public DateTime HoraEntrada { get; set; }
    
    public DateTime? HoraSaida { get; set; }
    
    public bool Ativa { get; set; } = true;
    
    [MaxLength(10)]
    public string? Pin { get; set; } // PIN de 4 dígitos para checkout
    
    public Vaga? Vaga { get; set; }
}
