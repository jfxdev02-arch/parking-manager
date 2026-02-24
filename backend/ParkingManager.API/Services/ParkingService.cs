using Microsoft.EntityFrameworkCore;
using QRCoder;
using ParkingManager.API.Data;
using ParkingManager.API.Models;

namespace ParkingManager.API.Services;

public class ParkingService : IParkingService
{
    private readonly ParkingDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ParkingService> _logger;
    
    public ParkingService(ParkingDbContext context, IConfiguration configuration, ILogger<ParkingService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }
    
    public async Task InitializeVagasAsync()
    {
        if (await _context.Vagas.AnyAsync()) return;
        
        var vagas = new List<Vaga>();
        for (int i = 1; i <= 50; i++)
        {
            vagas.Add(new Vaga
            {
                Numero = i,
                Lado = i <= 25 ? "Esquerdo" : "Direito",
                Ocupada = false,
                QrCodeToken = Guid.NewGuid().ToString("N")
            });
        }
        
        _context.Vagas.AddRange(vagas);
        await _context.SaveChangesAsync();
        _logger.LogInformation("50 vagas inicializadas");
    }
    
    public async Task<List<VagaResponse>> GetAllVagasAsync()
    {
        var vagas = await _context.Vagas.ToListAsync();
        var ocupacoesAtivas = await _context.Ocupacoes
            .Where(o => o.Ativa)
            .ToListAsync();
        
        return vagas.Select(v => {
            var ocupacao = ocupacoesAtivas.FirstOrDefault(o => o.VagaId == v.Id);
            return new VagaResponse
            {
                Numero = v.Numero,
                Lado = v.Lado,
                Ocupada = v.Ocupada,
                NomeUsuario = ocupacao?.NomeUsuario,
                HoraEntrada = ocupacao?.HoraEntrada
            };
        }).OrderBy(v => v.Numero).ToList();
    }
    
    public async Task<VagaResponse?> GetVagaAsync(int numero)
    {
        var vaga = await _context.Vagas.FirstOrDefaultAsync(v => v.Numero == numero);
        if (vaga == null) return null;
        
        var ocupacaoAtiva = await _context.Ocupacoes
            .FirstOrDefaultAsync(o => o.VagaId == vaga.Id && o.Ativa);
        
        return new VagaResponse
        {
            Numero = vaga.Numero,
            Lado = vaga.Lado,
            Ocupada = vaga.Ocupada,
            NomeUsuario = ocupacaoAtiva?.NomeUsuario,
            HoraEntrada = ocupacaoAtiva?.HoraEntrada
        };
    }
    
    public async Task<(bool Success, string Message, string? Pin)> CheckinAsync(int numero, string nomeUsuario)
    {
        var vaga = await _context.Vagas.FirstOrDefaultAsync(v => v.Numero == numero);
        if (vaga == null) return (false, "Vaga não encontrada", null);
        if (vaga.Ocupada) return (false, "Vaga já está ocupada", null);
        
        var pin = new Random().Next(1000, 9999).ToString();
        
        var ocupacao = new Ocupacao
        {
            VagaId = vaga.Id,
            NomeUsuario = nomeUsuario,
            HoraEntrada = DateTime.UtcNow,
            Ativa = true,
            Pin = pin
        };
        
        vaga.Ocupada = true;
        _context.Ocupacoes.Add(ocupacao);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Check-in na vaga {Numero} por {Usuario}", numero, nomeUsuario);
        return (true, "Check-in realizado com sucesso", pin);
    }
    
    public async Task<(bool Success, string Message)> CheckoutAsync(int numero, string nomeUsuario, string? pin)
    {
        var vaga = await _context.Vagas.FirstOrDefaultAsync(v => v.Numero == numero);
        
        if (vaga == null) return (false, "Vaga não encontrada");
        if (!vaga.Ocupada) return (false, "Vaga já está livre");
        
        var ocupacaoAtiva = await _context.Ocupacoes
            .FirstOrDefaultAsync(o => o.VagaId == vaga.Id && o.Ativa);
        
        if (ocupacaoAtiva == null) return (false, "Nenhuma ocupação ativa encontrada");
        
        // Validar nome
        if (!string.Equals(ocupacaoAtiva.NomeUsuario, nomeUsuario, StringComparison.OrdinalIgnoreCase))
            return (false, "Nome não confere com o check-in");
        
        // Validar PIN
        if (!string.IsNullOrEmpty(ocupacaoAtiva.Pin) && ocupacaoAtiva.Pin != pin)
            return (false, "PIN incorreto");
        
        ocupacaoAtiva.HoraSaida = DateTime.UtcNow;
        ocupacaoAtiva.Ativa = false;
        vaga.Ocupada = false;
        
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Check-out da vaga {Numero} por {Usuario}", numero, nomeUsuario);
        return (true, "Check-out realizado com sucesso");
    }
    
    public async Task<byte[]> GenerateQrCodeAsync(int numero, string baseUrl)
    {
        var vaga = await _context.Vagas.FirstOrDefaultAsync(v => v.Numero == numero);
        if (vaga == null) throw new Exception("Vaga não encontrada");
        
        var url = $"{baseUrl}/vaga/{numero}?action=checkin";
        
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        
        return qrCode.GetGraphic(20);
    }
    
    public async Task<StatusGeralResponse> GetStatusGeralAsync()
    {
        var total = await _context.Vagas.CountAsync();
        var ocupadas = await _context.Vagas.CountAsync(v => v.Ocupada);
        
        return new StatusGeralResponse
        {
            TotalVagas = total,
            VagasLivres = total - ocupadas,
            VagasOcupadas = ocupadas
        };
    }
    
    public async Task<List<Ocupacao>> GetHistoricoAsync()
    {
        return await _context.Ocupacoes
            .OrderByDescending(o => o.HoraEntrada)
            .Take(100)
            .ToListAsync();
    }
    
    public async Task<int> CleanupExpiredVagasAsync()
    {
        var timeoutHours = _configuration.GetValue<int>("ParkingSettings:TimeoutHours", 12);
        var cutoff = DateTime.UtcNow.AddHours(-timeoutHours);
        
        var expiradas = await _context.Ocupacoes
            .Where(o => o.Ativa && o.HoraEntrada < cutoff)
            .ToListAsync();
        
        foreach (var ocupacao in expiradas)
        {
            var vaga = await _context.Vagas.FirstOrDefaultAsync(v => v.Id == ocupacao.VagaId);
            if (vaga != null)
            {
                ocupacao.Ativa = false;
                ocupacao.HoraSaida = DateTime.UtcNow;
                vaga.Ocupada = false;
                _logger.LogWarning("Vaga {Numero} liberada automaticamente (timeout)", vaga.Numero);
            }
        }
        
        await _context.SaveChangesAsync();
        return expiradas.Count;
    }
}
