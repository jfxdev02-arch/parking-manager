using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ParkingManager.API.Hubs;
using ParkingManager.API.Models;
using ParkingManager.API.Services;

namespace ParkingManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VagasController : ControllerBase
{
    private readonly IParkingService _parkingService;
    private readonly IHubContext<ParkingHub> _hubContext;
    private readonly IConfiguration _configuration;
    
    public VagasController(IParkingService parkingService, IHubContext<ParkingHub> hubContext, IConfiguration configuration)
    {
        _parkingService = parkingService;
        _hubContext = hubContext;
        _configuration = configuration;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<VagaResponse>>> GetAll()
    {
        var vagas = await _parkingService.GetAllVagasAsync();
        return Ok(vagas);
    }
    
    [HttpGet("{numero}")]
    public async Task<ActionResult<VagaResponse>> Get(int numero)
    {
        var vaga = await _parkingService.GetVagaAsync(numero);
        if (vaga == null) return NotFound();
        return Ok(vaga);
    }
    
    [HttpPost("{numero}/checkin")]
    public async Task<ActionResult> Checkin(int numero, [FromBody] CheckinRequest request)
    {
        var (success, message, pin) = await _parkingService.CheckinAsync(numero, request.NomeUsuario);
        
        if (!success) return BadRequest(new { message });
        
        // Notificar clientes em tempo real
        var vaga = await _parkingService.GetVagaAsync(numero);
        await _hubContext.Clients.Group("parking").SendAsync("VagaAtualizada", new VagaAtualizadaEvent
        {
            VagaNumero = numero,
            Ocupada = true,
            NomeUsuario = request.NomeUsuario,
            HoraEntrada = vaga?.HoraEntrada
        });
        
        // Enviar status geral atualizado
        var status = await _parkingService.GetStatusGeralAsync();
        await _hubContext.Clients.Group("parking").SendAsync("StatusGeral", new StatusGeralEvent
        {
            TotalLivre = status.VagasLivres,
            TotalOcupado = status.VagasOcupadas
        });
        
        return Ok(new { message, pin });
    }
    
    [HttpPost("{numero}/checkout")]
    public async Task<ActionResult> Checkout(int numero, [FromBody] CheckoutRequest request)
    {
        var (success, message) = await _parkingService.CheckoutAsync(numero, request.NomeUsuario, request.Pin);
        
        if (!success) return BadRequest(new { message });
        
        // Notificar clientes em tempo real
        await _hubContext.Clients.Group("parking").SendAsync("VagaAtualizada", new VagaAtualizadaEvent
        {
            VagaNumero = numero,
            Ocupada = false,
            NomeUsuario = null,
            HoraEntrada = null
        });
        
        // Enviar status geral atualizado
        var status = await _parkingService.GetStatusGeralAsync();
        await _hubContext.Clients.Group("parking").SendAsync("StatusGeral", new StatusGeralEvent
        {
            TotalLivre = status.VagasLivres,
            TotalOcupado = status.VagasOcupadas
        });
        
        return Ok(new { message });
    }
    
    [HttpGet("{numero}/qrcode")]
    public async Task<ActionResult> GetQrCode(int numero)
    {
        try
        {
            var baseUrl = _configuration["ParkingSettings:BaseUrl"] ?? "http://localhost:5173";
            var qrCodeBytes = await _parkingService.GenerateQrCodeAsync(numero, baseUrl);
            return File(qrCodeBytes, "image/png");
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
