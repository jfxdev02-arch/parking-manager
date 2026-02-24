import type { Vaga as VagaType } from "../../types";

interface VagaProps {
  vaga: VagaType;
  onClick?: () => void;
}

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
        relative w-14 h-20 rounded-lg flex flex-col items-center justify-center
        cursor-pointer transition-all duration-300 transform hover:scale-105
        ${vaga.ocupada 
          ? "bg-red-500 text-white shadow-lg shadow-red-500/50" 
          : "bg-green-500 text-white shadow-lg shadow-green-500/50"
        }
      `}
    >
      <span className="text-xs font-bold">{vaga.numero.toString().padStart(2, "0")}</span>
      {vaga.ocupada && (
        <>
          <span className="text-[10px] truncate max-w-full px-1">{vaga.nomeUsuario}</span>
          {horaEntrada && <span className="text-[8px] opacity-80">{horaEntrada}</span>}
        </>
      )}
    </div>
  );
}
