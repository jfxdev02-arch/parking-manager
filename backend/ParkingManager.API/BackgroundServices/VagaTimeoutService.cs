using ParkingManager.API.Services;

namespace ParkingManager.API.BackgroundServices;

public class VagaTimeoutService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<VagaTimeoutService> _logger;
    
    public VagaTimeoutService(IServiceProvider serviceProvider, ILogger<VagaTimeoutService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var parkingService = scope.ServiceProvider.GetRequiredService<IParkingService>();
                
                var liberadas = await parkingService.CleanupExpiredVagasAsync();
                if (liberadas > 0)
                {
                    _logger.LogInformation("{Count} vagas liberadas automaticamente", liberadas);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao verificar timeout de vagas");
            }
            
            // Verifica a cada 5 minutos
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
