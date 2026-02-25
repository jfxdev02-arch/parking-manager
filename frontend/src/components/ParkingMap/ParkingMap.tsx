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
    <div className="parking-container" style={{ padding: 20 }}>
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

      {/* Mapa */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Guarita */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="guarita">
            <span className="seta seta-entrada">→ ENTRADA</span>
            <span>🏠 GUARITA</span>
            <span className="seta seta-saida">SAÍDA ←</span>
          </div>
        </div>

        {/* Linha 1: Vagas 01-25 */}
        <div style={{ textAlign: "center", marginBottom: 5, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          VAGAS 01 - 25
        </div>
        <div className="vaga-linha">
          {linha1.map(v => (
            <ParkingSpot key={v.numero} vaga={v} onClick={() => handleClick(v.numero)} />
          ))}
        </div>

        {/* Corredor */}
        <div className="corredor">
          <div className="corredor-linha"></div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>CORREDOR</span>
          <div className="corredor-linha"></div>
        </div>

        {/* Linha 2: Vagas 26-50 */}
        <div style={{ textAlign: "center", marginBottom: 5, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          VAGAS 26 - 50
        </div>
        <div className="vaga-linha">
          {linha2.map(v => (
            <ParkingSpot key={v.numero} vaga={v} onClick={() => handleClick(v.numero)} />
          ))}
        </div>

      </div>

      {/* Legenda */}
      <div style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
        <span style={{ marginRight: 20 }}>🟢 Livre</span>
        <span>🔴 Ocupada</span>
      </div>
    </div>
  );
}
