using Microsoft.EntityFrameworkCore;
using ParkingManager.API.Data;
using ParkingManager.API.Hubs;
using ParkingManager.API.Services;
using ParkingManager.API.BackgroundServices;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ParkingDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<IParkingService, ParkingService>();

// SignalR
builder.Services.AddSignalR();

// Background Services
builder.Services.AddHostedService<VagaTimeoutService>();

// CORS para frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://76.13.225.52:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ParkingDbContext>();
    context.Database.EnsureCreated();
    
    var parkingService = scope.ServiceProvider.GetRequiredService<IParkingService>();
    await parkingService.InitializeVagasAsync();
}

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();
app.MapHub<ParkingHub>("/hubs/estacionamento");

app.Run();
