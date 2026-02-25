import type { Vaga } from "../../types";

interface ParkingSpotProps {
  vaga: Vaga;
  onClick?: () => void;
}

// Carro SVG premium
const CarSVG = ({ color = "#3b82f6" }: { color?: string }) => (
  <svg viewBox="0 0 44 58" className="car-render" style={{ width: 42, height: 55 }}>
    {/* Sombra */}
    <ellipse cx="22" cy="54" rx="16" ry="3" fill="rgba(0,0,0,0.3)" />
    {/* Corpo */}
    <path d="M6 38 L6 22 C6 18 10 14 14 12 L30 12 C34 14 38 18 38 22 L38 38 C38 42 35 46 30 46 L14 46 C9 46 6 42 6 38 Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
    {/* Teto */}
    <path d="M12 22 L14 12 C14 10 16 8 22 8 C28 8 30 10 30 12 L32 22 Z" fill={color} opacity="0.9" />
    {/* Janelas */}
    <path d="M14 20 L15 13 C15 11 17 10 22 10 C27 10 29 11 29 13 L30 20 Z" fill="rgba(135, 206, 235, 0.7)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
    <line x1="22" y1="10" x2="22" y2="20" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
    {/* Faróis */}
    <ellipse cx="12" cy="42" rx="3" ry="2" fill="#fef08a" opacity="0.9" />
    <ellipse cx="32" cy="42" rx="3" ry="2" fill="#fef08a" opacity="0.9" />
    {/* Lanternas */}
    <rect x="9" y="18" width="3" height="2" rx="0.5" fill="#ef4444" opacity="0.8" />
    <rect x="32" y="18" width="3" height="2" rx="0.5" fill="#ef4444" opacity="0.8" />
    {/* Rodas */}
    <ellipse cx="12" cy="44" rx="4" ry="3" fill="#1a1a1a" />
    <ellipse cx="32" cy="44" rx="4" ry="3" fill="#1a1a1a" />
    <ellipse cx="12" cy="44" rx="2" ry="1.5" fill="#4a4a4a" />
    <ellipse cx="32" cy="44" rx="2" ry="1.5" fill="#4a4a4a" />
    {/* Linha lateral */}
    <line x1="8" y1="30" x2="36" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
  </svg>
);

// Cores variadas
const CAR_COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#64748b", "#1e293b", "#f8fafc"];

export function ParkingSpot({ vaga, onClick }: ParkingSpotProps) {
  const horaEntrada = vaga.horaEntrada
    ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  const carColor = vaga.nomeUsuario ? CAR_COLORS[vaga.nomeUsuario.length % CAR_COLORS.length] : CAR_COLORS[0];
  
  const spotClassName = vaga.ocupada ? "parking-spot occupied" : "parking-spot free";

  return (
    <div
      onClick={onClick}
      className={spotClassName}
      style={{ 
        flexShrink: 0,
        position: "relative",
        zIndex: 1
      }}
    >
      {/* Número */}
      <span className="spot-number">{vaga.numero.toString().padStart(2, "0")}</span>

      {/* Carro se ocupada */}
      {vaga.ocupada && <CarSVG color={carColor} />}

      {/* Info card no hover */}
      {vaga.ocupada && (
        <div className="spot-info-card">
          <div className="spot-info-name">{vaga.nomeUsuario}</div>
          {horaEntrada && (
            <div className="spot-info-time">
              <span>⏱</span>
              <span>{horaEntrada}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
