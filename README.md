# 🚗 Parking Manager - Estacionamento Comunitário

Sistema de gerenciamento comunitário de estacionamento com check-in/check-out via QR Code.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + SignalR Client
- **Backend:** .NET 8 Web API + SignalR + Entity Framework Core + SQLite
- **Infra:** Docker Compose

## Funcionalidades

- Mapa visual do estacionamento (50 vagas)
- Check-in/Check-out via QR Code (mobile)
- Atualização em tempo real (SignalR)
- Timeout automático de vagas
- PIN de 4 dígitos para segurança

## Executar

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

## Estrutura

```
parking-manager/
├── frontend/     # React + Vite + TypeScript
├── backend/      # .NET 8 Web API
├── docs/         # Documentação
└── docker-compose.yml
```
