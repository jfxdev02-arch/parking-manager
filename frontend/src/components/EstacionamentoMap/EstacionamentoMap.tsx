import { useNavigate } from "react-router-dom";
import { Vaga } from "../Vaga";
import type { Vaga as VagaType, StatusGeral } from "../../types";

interface EstacionamentoMapProps {
  vagas: VagaType[];
  status: StatusGeral | null;
  loading: boolean;
}

export function EstacionamentoMap({ vagas, status, loading }: EstacionamentoMapProps) {
  const navigate = useNavigate();

  // Linha superior: vagas 01-25 (Lado Esquerdo)
  // Linha inferior: vagas 26-50 (Lado Direito)
  const linhaSuperior = vagas.filter((v) => v.numero >= 1 && v.numero <= 25).sort((a, b) => a.numero - b.numero);
  const linhaInferior = vagas.filter((v) => v.numero >= 26 && v.numero <= 50).sort((a, b) => a.numero - b.numero);

  const handleVagaClick = (numero: number) => {
    navigate(`/vaga/${numero}?action=checkin`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4 animate-bounce">🚗</div>
          <div className="text-white text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🅿️</span>
              Estacionamento
            </h1>
            
            {status && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <div className="text-center">
                    <div className="text-green-400 text-xs">Livres</div>
                    <div className="text-white font-bold">{status.vagasLivres}</div>
                  </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  <div className="text-center">
                    <div className="text-red-400 text-xs">Ocupadas</div>
                    <div className="text-white font-bold">{status.vagasOcupadas}</div>
                  </div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-full px-4 py-2 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <div className="text-center">
                    <div className="text-blue-400 text-xs">Total</div>
                    <div className="text-white font-bold">{status.totalVagas}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {status && status.vagasLivres <= 5 && (
            <div className="mt-4 bg-red-500/30 border border-red-500 rounded-lg px-4 py-3 text-white text-center animate-pulse">
              ⚠️ Atenção! Apenas {status.vagasLivres} vagas disponíveis!
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="max-w-6xl mx-auto mb-4 flex justify-end">
        <div className="glass-card rounded-xl p-4 text-white text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
              <span>Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span>→ ENTRADA</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <span>SAÍDA ←</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAPA DO ESTACIONAMENTO - PERSPECTIVA */}
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
          
          {/* Setas de fluxo */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-4xl animate-pulse z-10">
            →
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 text-4xl animate-pulse z-10">
            ←
          </div>

          {/* Container com perspectiva */}
          <div 
            className="relative mx-auto"
            style={{
              perspective: "1000px",
            }}
          >
            {/* Área do estacionamento */}
            <div 
              className="relative bg-gray-600 rounded-xl p-6"
              style={{
                transform: "rotateX(25deg)",
                transformStyle: "preserve-3d",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
              }}
            >
              {/* LINHA SUPERIOR - Vagas 01-25 */}
              <div className="mb-6">
                <div className="text-white/60 text-xs font-medium mb-2 text-center">
                  VAGAS 01-25
                </div>
                <div className="flex justify-center gap-1 flex-wrap">
                  {linhaSuperior.map((vaga) => (
                    <Vaga 
                      key={vaga.numero} 
                      vaga={vaga} 
                      onClick={() => handleVagaClick(vaga.numero)} 
                    />
                  ))}
                </div>
              </div>

              {/* CORREDOR CENTRAL */}
              <div className="flex items-center justify-center py-4 my-4">
                <div className="flex-1 h-1 bg-yellow-400/50 rounded"></div>
                <div className="mx-4 px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm font-semibold shadow-lg">
                  🏠 GUARITA
                </div>
                <div className="flex-1 h-1 bg-yellow-400/50 rounded"></div>
              </div>

              {/* LINHA INFERIOR - Vagas 26-50 */}
              <div className="mt-6">
                <div className="text-white/60 text-xs font-medium mb-2 text-center">
                  VAGAS 26-50
                </div>
                <div className="flex justify-center gap-1 flex-wrap">
                  {linhaInferior.map((vaga) => (
                    <Vaga 
                      key={vaga.numero} 
                      vaga={vaga} 
                      onClick={() => handleVagaClick(vaga.numero)} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Labels de entrada/saída */}
          <div className="flex justify-between mt-4 px-8">
            <div className="text-green-400 font-semibold text-sm">
              ⬇️ ENTRADA
            </div>
            <div className="text-orange-400 font-semibold text-sm">
              SAÍDA ⬆️
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center text-white/50 text-sm">
          Clique em uma vaga para fazer check-in ou check-out
        </div>
      </div>
    </div>
  );
}
