import { useNavigate } from "react-router-dom";
import { Vaga } from "../Vaga";
import { Guarita } from "../Guarita";
import type { Vaga as VagaType, StatusGeral } from "../../types";

interface EstacionamentoMapProps {
  vagas: VagaType[];
  status: StatusGeral | null;
  loading: boolean;
}

export function EstacionamentoMap({ vagas, status, loading }: EstacionamentoMapProps) {
  const navigate = useNavigate();

  const vagasEsquerda = vagas.filter((v) => v.lado === "Esquerdo");
  const vagasDireita = vagas.filter((v) => v.lado === "Direito");

  const handleVagaClick = (numero: number) => {
    navigate(`/vaga/${numero}?action=checkin`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🚗 Estacionamento</h1>
        {status && (
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-2 shadow-lg">
            <span className="text-green-600 font-semibold">
              Livres: {status.vagasLivres}
            </span>
            <span className="text-red-600 font-semibold">
              Ocupadas: {status.vagasOcupadas}
            </span>
            <span className="text-gray-600">
              Total: {status.totalVagas}
            </span>
          </div>
        )}
        {status && status.vagasLivres <= 5 && (
          <div className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg inline-block animate-pulse">
            ⚠️ Poucas vagas disponíveis!
          </div>
        )}
      </div>

      {/* Mapa do Estacionamento */}
      <div className="bg-gray-100 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-start gap-4">
          {/* Lado Esquerdo */}
          <div className="flex-1">
            <div className="text-center text-gray-600 font-semibold mb-3">Lado Esquerdo</div>
            <div className="grid grid-cols-5 gap-2">
              {vagasEsquerda.map((vaga) => (
                <Vaga key={vaga.numero} vaga={vaga} onClick={() => handleVagaClick(vaga.numero)} />
              ))}
            </div>
          </div>

          {/* Corredor Central com Guarita */}
          <div className="flex flex-col items-center justify-center py-8">
            <Guarita />
            <div className="mt-4 text-gray-500 text-sm text-center">
              <div className="bg-gray-200 px-3 py-1 rounded mb-2">⬇️ ENTRADA</div>
              <div className="h-20 w-1 bg-yellow-400 rounded my-2"></div>
              <div className="bg-gray-200 px-3 py-1 rounded">⬆️ SAÍDA</div>
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex-1">
            <div className="text-center text-gray-600 font-semibold mb-3">Lado Direito</div>
            <div className="grid grid-cols-5 gap-2">
              {vagasDireita.map((vaga) => (
                <Vaga key={vaga.numero} vaga={vaga} onClick={() => handleVagaClick(vaga.numero)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Ocupada</span>
        </div>
      </div>
    </div>
  );
}
