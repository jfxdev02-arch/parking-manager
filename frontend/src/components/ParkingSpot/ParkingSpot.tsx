import type { Vaga } from "../../types";

interface ParkingSpotProps {
  vaga: Vaga;
  onClick?: () => void;
}

const CarroSVG = () => (
  <svg className="carro" width="32" height="42" viewBox="0 0 32 42">
    {/* Sombra */}
    <ellipse cx="16" cy="39" rx="12" ry="2" fill="rgba(0,0,0,0.3)" />
    {/* Corpo do carro */}
    <rect x="4" y="14" width="24" height="18" rx="3" fill="#475569"/>
    {/* Teto */}
    <path d="M8 14 L10 6 C10 4 12 2 16 2 C20 2 22 4 22 6 L24 14 Z" fill="#64748b"/>
    {/* Janelas */}
    <path d="M10 12 L11 7 C11 5 13 4 16 4 C19 4 21 5 21 7 L22 12 Z" fill="rgba(147,197,253,0.6)"/>
    {/* Divisão das janelas */}
    <line x1="16" y1="4" x2="16" y2="12" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
    {/* Faróis */}
    <ellipse cx="8" cy="30" rx="2" ry="1.5" fill="#fef08a" opacity="0.8"/>
    <ellipse cx="24" cy="30" rx="2" ry="1.5" fill="#fef08a" opacity="0.8"/>
    {/* Lanternas */}
    <rect x="6" y="10" width="2" height="1.5" rx="0.5" fill="#fca5a5" opacity="0.8"/>
    <rect x="24" y="10" width="2" height="1.5" rx="0.5" fill="#fca5a5" opacity="0.8"/>
    {/* Rodas */}
    <ellipse cx="9" cy="32" rx="3" ry="2.5" fill="#1e293b"/>
    <ellipse cx="23" cy="32" rx="3" ry="2.5" fill="#1e293b"/>
    <ellipse cx="9" cy="32" rx="1.5" ry="1.2" fill="#374151"/>
    <ellipse cx="23" cy="32" rx="1.5" ry="1.2" fill="#374151"/>
    {/* Linha de detalhe */}
    <line x1="5" y1="22" x2="27" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
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
