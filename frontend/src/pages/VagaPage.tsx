import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getVaga, checkin, checkout } from "../services/api";
import type { Vaga } from "../types";

export function VagaPage() {
  const { numero } = useParams<{ numero: string }>();
  const navigate = useNavigate();
  
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPin, setShowPin] = useState<string | null>(null);
  const [animate, setAnimate] = useState<string | null>(null);

  useEffect(() => {
    if (numero) loadVaga();
  }, [numero]);

  const loadVaga = async () => {
    try {
      const data = await getVaga(parseInt(numero!));
      setVaga(data);
    } catch (error) {
      setMessage("Erro ao carregar vaga");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    if (!nome.trim()) {
      setMessage("Por favor, informe seu nome");
      setMessageType("error");
      return;
    }

    try {
      const result = await checkin(parseInt(numero!), nome);
      if (result.pin) {
        setShowPin(result.pin);
        setAnimate("checkin");
        setMessage(result.message);
        setMessageType("success");
        setTimeout(() => setAnimate(null), 2000);
      }
    } catch (error) {
      setMessage("Erro ao fazer check-in");
      setMessageType("error");
    }
  };

  const handleCheckout = async () => {
    if (!nome.trim()) {
      setMessage("Por favor, confirme seu nome");
      setMessageType("error");
      return;
    }

    try {
      const result = await checkout(parseInt(numero!), nome, pin);
      setMessage(result.message);
      setMessageType("success");
      setAnimate("checkout");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage("Erro ao fazer check-out");
      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4 animate-spin">🚗</div>
          <div className="text-white">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Vaga {numero?.toString().padStart(2, "0")}
          </h1>
          <p className="text-white/60">{vaga?.lado}</p>
        </div>

        {/* Animação de sucesso */}
        {animate === "checkin" && (
          <div className="text-center text-6xl mb-4 animate-bounce">✅</div>
        )}
        {animate === "checkout" && (
          <div className="text-center text-5xl mb-4 animate-pulse">🚗💨</div>
        )}

        {/* PIN Display */}
        {showPin && (
          <div className="glass-card rounded-xl p-6 mb-4 text-center border-2 border-yellow-500/50">
            <div className="text-yellow-400 text-sm mb-2">Seu PIN de checkout:</div>
            <div className="text-5xl font-bold text-white tracking-widest">{showPin}</div>
            <div className="text-yellow-400/60 text-xs mt-2">📱 Anote este número!</div>
          </div>
        )}

        {/* Vaga Livre - Check-in */}
        {!vaga?.ocupada && !showPin && (
          <div className="glass-card rounded-2xl p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 text-green-400">
                <span className="text-xl">🟢</span>
                <span className="font-semibold">Vaga Livre</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-white/70 text-sm font-medium mb-2">
                Seu nome ou placa:
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Ex: João ou ABC-1234"
              />
            </div>

            <button
              onClick={handleCheckin}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg shadow-lg shadow-green-500/30"
            >
              🅿️ Estacionar Aqui
            </button>
          </div>
        )}

        {/* Vaga Ocupada - Check-out */}
        {vaga?.ocupada && !animate && (
          <div className="glass-card rounded-2xl p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2 text-red-400 mb-3">
                <span className="text-xl">🔴</span>
                <span className="font-semibold">Vaga Ocupada</span>
              </div>
              <div className="text-white">
                por <strong className="text-lg">{vaga.nomeUsuario}</strong>
              </div>
              {vaga.horaEntrada && (
                <div className="text-white/60 text-sm mt-1">
                  ⏰ desde {new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR")}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-white/70 text-sm font-medium mb-2">
                Confirme seu nome:
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                placeholder="Digite o nome do check-in"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white/70 text-sm font-medium mb-2">
                PIN (se tiver):
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                placeholder="****"
                maxLength={4}
              />
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg shadow-lg shadow-red-500/30"
            >
              🚗 Liberar Vaga
            </button>
          </div>
        )}

        {/* QR Code */}
        <div className="glass-card rounded-xl p-4 mt-6 text-center">
          <div className="text-white/60 text-sm mb-3">QR Code desta vaga:</div>
          <div className="inline-block bg-white p-3 rounded-xl">
            <QRCodeSVG 
              value={`http://76.13.225.52:5173/vaga/${numero}?action=checkin`} 
              size={120} 
            />
          </div>
        </div>

        {/* Mensagem */}
        {message && (
          <div className={`mt-4 rounded-xl px-4 py-3 text-center ${
            messageType === "success" 
              ? "bg-green-500/20 border border-green-500/50 text-green-400" 
              : "bg-red-500/20 border border-red-500/50 text-red-400"
          }`}>
            {message}
          </div>
        )}

        {/* Voltar */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full glass-card hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all"
        >
          ← Voltar ao Mapa
        </button>
      </div>
    </div>
  );
}
