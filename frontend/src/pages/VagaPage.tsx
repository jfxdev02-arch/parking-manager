import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getVaga, checkin, checkout } from "../services/api";
import type { Vaga } from "../types";

export function VagaPage() {
  const { numero } = useParams<{ numero: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [showPin, setShowPin] = useState<string | null>(null);
  const [animate, setAnimate] = useState<string | null>(null);

  useEffect(() => {
    if (numero) {
      loadVaga();
    }
  }, [numero]);

  const loadVaga = async () => {
    try {
      const data = await getVaga(parseInt(numero!));
      setVaga(data);
    } catch (error) {
      setMessage("Erro ao carregar vaga");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    if (!nome.trim()) {
      setMessage("Por favor, informe seu nome");
      return;
    }

    try {
      const result = await checkin(parseInt(numero!), nome);
      if (result.pin) {
        setShowPin(result.pin);
        setAnimate("checkin");
        setTimeout(() => {
          setVaga((v) => v ? { ...v, ocupada: true, nomeUsuario: nome, horaEntrada: new Date().toISOString() } : v);
          setAnimate(null);
        }, 1500);
      }
      setMessage(result.message);
    } catch (error) {
      setMessage("Erro ao fazer check-in");
    }
  };

  const handleCheckout = async () => {
    if (!nome.trim()) {
      setMessage("Por favor, confirme seu nome");
      return;
    }

    try {
      const result = await checkout(parseInt(numero!), nome, pin);
      setMessage(result.message);
      setAnimate("checkout");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage("Erro ao fazer check-out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  const vagaNumero = parseInt(numero || "0");
  const qrCodeUrl = `http://76.13.225.52:5000/api/vagas/${vagaNumero}/qrcode`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Vaga {vagaNumero.toString().padStart(2, "0")}</h1>
          <p className="text-gray-600">{vaga?.lado}</p>
        </div>

        {/* Animação */}
        {animate === "checkin" && (
          <div className="text-center text-6xl animate-bounce mb-4">✅</div>
        )}
        {animate === "checkout" && (
          <div className="text-center text-4xl animate-pulse mb-4">🚗💨</div>
        )}

        {/* PIN Display */}
        {showPin && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4 text-center">
            <p className="text-sm text-yellow-800 mb-2">Seu PIN de checkout:</p>
            <p className="text-3xl font-bold text-yellow-900">{showPin}</p>
            <p className="text-xs text-yellow-700 mt-2">Anote este número!</p>
          </div>
        )}

        {/* Vaga Livre - Check-in */}
        {!vaga?.ocupada && !showPin && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm mb-4">
                Vaga Livre
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Seu nome ou apelido:
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: João ou ABC-1234"
              />
            </div>

            <button
              onClick={handleCheckin}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            >
              🅿️ Estacionar Aqui
            </button>
          </div>
        )}

        {/* Vaga Ocupada - Check-out */}
        {vaga?.ocupada && !animate && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm mb-2">
                Vaga Ocupada
              </div>
              <p className="text-gray-600">
                por <strong>{vaga.nomeUsuario}</strong>
              </p>
              {vaga.horaEntrada && (
                <p className="text-sm text-gray-500">
                  desde {new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR")}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirme seu nome:
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Digite o nome do check-in"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                PIN (se tiver):
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="4 dígitos"
                maxLength={4}
              />
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            >
              🚗 Liberar Vaga
            </button>
          </div>
        )}

        {/* QR Code */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">QR Code desta vaga:</p>
          <div className="inline-block bg-white p-2 rounded-lg border">
            <QRCodeSVG value={`http://76.13.225.52:5173/vaga/${vagaNumero}?action=checkin`} size={120} />
          </div>
        </div>

        {/* Mensagem */}
        {message && (
          <div className="mt-4 bg-blue-100 text-blue-800 px-4 py-3 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Voltar */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
        >
          ← Voltar ao Mapa
        </button>
      </div>
    </div>
  );
}
