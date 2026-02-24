using Microsoft.AspNetCore.SignalR;
using ParkingManager.API.Models;
using ParkingManager.API.Services;

namespace ParkingManager.API.Hubs;

public class ParkingHub : Hub
{
    private readonly IParkingService _parkingService;
    private readonly ILogger<ParkingHub> _logger;
    
    public ParkingHub(IParkingService parkingService, ILogger<ParkingHub> logger)
    {
        _parkingService = parkingService;
        _logger = logger;
    }
    
    public async Task JoinParking()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "parking");
        _logger.LogInformation("Cliente conectado ao grupo parking: {ConnectionId}", Context.ConnectionId);
        
        // Envia status inicial
        var status = await _parkingService.GetStatusGeralAsync();
        await Clients.Caller.SendAsync("StatusGeral", new StatusGeralEvent
        {
            TotalLivre = status.VagasLivres,
            TotalOcupado = status.VagasOcupadas
        });
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "parking");
        _logger.LogInformation("Cliente desconectado: {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
