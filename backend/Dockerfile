FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ParkingManager.API/ParkingManager.API.csproj ParkingManager.API/
RUN dotnet restore ParkingManager.API/ParkingManager.API.csproj
COPY ParkingManager.API/ ParkingManager.API/
WORKDIR /src/ParkingManager.API
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "ParkingManager.API.dll"]
