using Microsoft.AspNetCore.Mvc;
using ParkingManager.API.Services;

namespace ParkingManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstacionamentoController : ControllerBase
{
    private readonly IParkingService _parkingService;
    
    public EstacionamentoController(IParkingService parkingService)
    {
        _parkingService = parkingService;
    }
    
    [HttpGet("status")]
    public async Task<ActionResult> GetStatus()
    {
        var status = await _parkingService.GetStatusGeralAsync();
        return Ok(status);
    }
}
