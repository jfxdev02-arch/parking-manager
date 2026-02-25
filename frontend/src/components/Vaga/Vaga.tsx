import type { Vaga as VagaType } from "../../types";

interface VagaProps {
  vaga: VagaType;
  onClick?: () => void;
}

// Ícone de carro SVG
const CarIcon = () => (
  <svg
    className="w-7 h-4 text-white/90"
    viewBox="0 0 28 16"
    fill="currentColor"
  >
    {/* Carro de cima */}
    <rect x="4" y="6" width="20" height="6" rx="2" />
    <rect x="6" y="2" width="6" height="5" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="14" y="2" width="8" height="5" rx="1" fill="currentColor" opacity="0.7" />
    {/* Rodas */}
    <circle cx="8" cy="12" r="2.5" fill="#333" />
    <circle cx="20" cy="12" r="2.5" fill="#333" />
  </svg>
);

export function Vaga({ vaga, onClick }: VagaProps) {
  const horaEntrada = vaga.horaEntrada
    ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-12 h-16 md:w-14 md:h-20 rounded-lg cursor-pointer
        transition-all duration-300 transform
        hover:scale-110 hover:-translate-y-1 hover:z-50
        ${vaga.ocupada 
          ? "bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/40" 
          : "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/40"
        }
      `}
      style={{
        boxShadow: vaga.ocupada 
          ? "0 4px 20px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
          : "0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
      }}
    >
      {/* Número da vaga */}
      <span className="text-xs font-bold text-white drop-shadow-md">
        {vaga.numero.toString().padStart(2, "0")}
      </span>

      {/* Ícone de carro se ocupada */}
      {vaga.ocupada && <CarIcon />}

      {/* Linhas de vaga */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <div className="absolute left-1 top-3 bottom-3 w-0.5 bg-white/20 rounded"></div>
        <div className="absolute right-1 top-3 bottom-3 w-0.5 bg-white/20 rounded"></div>
      </div>

      {/* Tooltip no hover */}
      {vaga.ocupada && vaga.nomeUsuario && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-gray-700">
            <div className="font-semibold">{vaga.nomeUsuario}</div>
            {horaEntrada && (
              <div className="text-gray-400 mt-1">⏰ {horaEntrada}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
