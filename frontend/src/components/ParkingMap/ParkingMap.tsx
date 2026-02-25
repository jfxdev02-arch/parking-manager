import { useNavigate } from "react-router-dom";
import { ParkingSpot } from "../ParkingSpot";
import { GateHouse } from "../GateHouse";
import type { Vaga, StatusGeral } from "../../types";

interface ParkingMapProps {
  vagas: Vaga[];
  status: StatusGeral | null;
  loading: boolean;
}

export function ParkingMap({ vagas, status, loading }: ParkingMapProps) {
  const navigate = useNavigate();

  // Linha superior: vagas 01-25
  // Linha inferior: vagas 26-50
  const linhaSuperior = vagas
    .filter((v) => v.numero >= 1 && v.numero <= 25)
    .sort((a, b) => a.numero - b.numero);
  
  const linhaInferior = vagas
    .filter((v) => v.numero >= 26 && v.numero <= 50)
    .sort((a, b) => a.numero - b.numero);

  const handleSpotClick = (numero: number) => {
    navigate(`/vaga/${numero}?action=checkin`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Carregando estacionamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30">
              🅿️
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Estacionamento</h1>
              <p className="text-white/50 text-sm">Sistema de Gerenciamento</p>
            </div>
          </div>

          {/* Stats */}
          {status && (
            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-icon free">🟢</div>
                <div>
                  <div className="stat-value">{status.vagasLivres}</div>
                  <div className="stat-label">Livres</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon occupied">🔴</div>
                <div>
                  <div className="stat-value">{status.vagasOcupadas}</div>
                  <div className="stat-label">Ocupadas</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon total">📊</div>
                <div>
                  <div className="stat-value">{status.totalVagas}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alerta */}
        {status && status.vagasLivres <= 5 && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-center text-sm flex items-center justify-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>Atenção! Apenas <strong>{status.vagasLivres}</strong> vagas disponíveis</span>
          </div>
        )}
      </div>

      {/* Parking Map */}
      <div className="parking-map-container">
        <div className="parking-surface">
          {/* Isometric View Container */}
          <div className="isometric-view">
            
            {/* Fluxo de entrada/saída */}
            <div className="flow-arrows">
              <div className="flow-arrow entry">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
                <span>Entrada</span>
              </div>
              <div className="flow-arrow exit">
                <span>Saída</span>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </div>
            </div>

            {/* LINHA SUPERIOR - Vagas 01-25 */}
            <div className="mb-6">
              <div className="parking-row-label">Vagas 01 - 25</div>
              <div className="parking-row">
                {linhaSuperior.map((vaga) => (
                  <ParkingSpot
                    key={vaga.numero}
                    vaga={vaga}
                    onClick={() => handleSpotClick(vaga.numero)}
                  />
                ))}
              </div>
            </div>

            {/* Corredor Central com Guarita */}
            <div className="road-corridor">
              <GateHouse />
            </div>

            {/* LINHA INFERIOR - Vagas 26-50 */}
            <div className="mt-6">
              <div className="parking-row-label">Vagas 26 - 50</div>
              <div className="parking-row">
                {linhaInferior.map((vaga) => (
                  <ParkingSpot
                    key={vaga.numero}
                    vaga={vaga}
                    onClick={() => handleSpotClick(vaga.numero)}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Legenda */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-8 text-sm text-white/60 bg-white/5 px-6 py-3 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-500/50 bg-green-500/20"></div>
              <span>Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-red-500/50 bg-red-500/20"></div>
              <span>Ocupada</span>
            </div>
            <div className="text-white/40">|</div>
            <span className="text-xs">Clique em uma vaga para check-in/out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
