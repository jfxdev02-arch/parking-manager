using ParkingManager.API.Models;

namespace ParkingManager.API.Services;

public interface IParkingService
{
    Task InitializeVagasAsync();
    Task<List<VagaResponse>> GetAllVagasAsync();
    Task<VagaResponse?> GetVagaAsync(int numero);
    Task<(bool Success, string Message, string? Pin)> CheckinAsync(int numero, string nomeUsuario);
    Task<(bool Success, string Message)> CheckoutAsync(int numero, string nomeUsuario, string? pin);
    Task<byte[]> GenerateQrCodeAsync(int numero, string baseUrl);
    Task<StatusGeralResponse> GetStatusGeralAsync();
    Task<List<Ocupacao>> GetHistoricoAsync();
    Task<int> CleanupExpiredVagasAsync();
}
