namespace ParkingManager.API.Models;

public class CheckinRequest
{
    public string NomeUsuario { get; set; } = string.Empty;
}

public class CheckoutRequest
{
    public string NomeUsuario { get; set; } = string.Empty;
    public string? Pin { get; set; }
}

public class VagaResponse
{
    public int Numero { get; set; }
    public string Lado { get; set; } = string.Empty;
    public bool Ocupada { get; set; }
    public string? NomeUsuario { get; set; }
    public DateTime? HoraEntrada { get; set; }
}

public class StatusGeralResponse
{
    public int TotalVagas { get; set; }
    public int VagasLivres { get; set; }
    public int VagasOcupadas { get; set; }
}

public class VagaAtualizadaEvent
{
    public int VagaNumero { get; set; }
    public bool Ocupada { get; set; }
    public string? NomeUsuario { get; set; }
    public DateTime? HoraEntrada { get; set; }
}

public class StatusGeralEvent
{
    public int TotalLivre { get; set; }
    public int TotalOcupado { get; set; }
}
