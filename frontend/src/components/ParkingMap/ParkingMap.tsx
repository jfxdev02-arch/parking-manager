import { useNavigate } from "react-router-dom";
import { ParkingSpot } from "../ParkingSpot";
import type { Vaga, StatusGeral } from "../../types";

interface ParkingMapProps {
  vagas: Vaga[];
  status: StatusGeral | null;
  loading: boolean;
}

export function ParkingMap({ vagas, status, loading }: ParkingMapProps) {
  const navigate = useNavigate();

  const linha1 = vagas.filter(v => v.numero >= 1 && v.numero <= 25).sort((a, b) => a.numero - b.numero);
  const linha2 = vagas.filter(v => v.numero >= 26 && v.numero <= 50).sort((a, b) => a.numero - b.numero);

  const handleClick = (numero: number) => navigate(`/vaga/${numero}?action=checkin`);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: 40 }}>🚗</div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parking-container">
      {/* Header */}
      <div className="header">
        <h1>🅿️ Estacionamento</h1>
      </div>

      {/* Stats */}
      {status && (
        <div className="stats">
          <div className="stat stat-livres">
            <div className="stat-valor">{status.vagasLivres}</div>
            <div className="stat-label">Livres</div>
          </div>
          <div className="stat stat-ocupadas">
            <div className="stat-valor">{status.vagasOcupadas}</div>
            <div className="stat-label">Ocupadas</div>
          </div>
          <div className="stat stat-total">
            <div className="stat-valor">{status.totalVagas}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      )}

      {/* Alerta */}
      {status && status.vagasLivres <= 5 && (
        <div className="alerta">
          ⚠️ Apenas {status.vagasLivres} vagas disponíveis!
        </div>
      )}

      {/* Mapa 3D */}
      <div className="parking-map">
        
        {/* Guarita */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="guarita">
            <span className="seta seta-entrada">→ ENTRADA</span>
            <span>🏠</span>
            <span className="seta seta-saida">SAÍDA ←</span>
          </div>
        </div>

        {/* LINHA 1: Vagas 01-25 */}
        <div className="linha-label">Vagas 01 - 25</div>
        <div className="vaga-linha">
          {linha1.map(v => (
            <ParkingSpot key={v.numero} vaga={v} onClick={() => handleClick(v.numero)} />
          ))}
        </div>

        {/* CORREDOR - vai do início ao fim */}
        <div className="corredor-container" style={{ height: 50 }}>
          <div className="corredor"></div>
        </div>

        {/* LINHA 2: Vagas 26-50 */}
        <div className="linha-label">Vagas 26 - 50</div>
        <div className="vaga-linha">
          {linha2.map(v => (
            <ParkingSpot key={v.numero} vaga={v} onClick={() => handleClick(v.numero)} />
          ))}
        </div>

      </div>

      {/* Legenda */}
      <div className="legenda">
        <div className="legenda-item">
          <div className="legenda-cor livre"></div>
          <span>Livre</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-cor ocupada"></div>
          <span>Ocupada</span>
        </div>
      </div>
    </div>
  );
}
