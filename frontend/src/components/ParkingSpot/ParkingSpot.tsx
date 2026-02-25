import type { Vaga } from "../../types";

interface ParkingSpotProps {
  vaga: Vaga;
  onClick?: () => void;
}

const CarroSVG = () => (
  <svg className="carro" width="36" height="48" viewBox="0 0 36 48">
    <rect x="4" y="12" width="28" height="24" rx="3" fill="#64748b"/>
    <rect x="8" y="4" width="20" height="12" rx="2" fill="#475569"/>
    <rect x="10" y="6" width="7" height="8" rx="1" fill="rgba(135,206,235,0.6)"/>
    <rect x="19" y="6" width="7" height="8" rx="1" fill="rgba(135,206,235,0.6)"/>
    <circle cx="10" cy="36" r="4" fill="#1e293b"/>
    <circle cx="26" cy="36" r="4" fill="#1e293b"/>
  </svg>
);

export function ParkingSpot({ vaga, onClick }: ParkingSpotProps) {
  const hora = vaga.horaEntrada 
    ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div 
      className={`vaga ${vaga.ocupada ? "ocupada" : "livre"}`}
      onClick={onClick}
    >
      <span className="vaga-numero">{vaga.numero.toString().padStart(2, "0")}</span>
      {vaga.ocupada && <CarroSVG />}
      {vaga.ocupada && (
        <div className="vaga-info">
          <div className="vaga-info-nome">{vaga.nomeUsuario}</div>
          {hora && <div className="vaga-info-hora">⏱ {hora}</div>}
        </div>
      )}
    </div>
  );
}
