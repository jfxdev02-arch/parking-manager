using Microsoft.AspNetCore.Mvc;
using ParkingManager.API.Services;

namespace ParkingManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OcupacoesController : ControllerBase
{
    private readonly IParkingService _parkingService;
    
    public OcupacoesController(IParkingService parkingService)
    {
        _parkingService = parkingService;
    }
    
    [HttpGet("historico")]
    public async Task<ActionResult> GetHistorico()
    {
        var historico = await _parkingService.GetHistoricoAsync();
        return Ok(historico);
    }
}
