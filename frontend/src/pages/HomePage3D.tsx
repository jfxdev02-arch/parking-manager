import { useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import { ParkingScene } from "../components/ParkingScene";
import { useEstacionamento } from "../hooks/useEstacionamento";

export function HomePage3D() {
  const navigate = useNavigate();
  const { vagas, status, loading } = useEstacionamento();
  const [showInfo, setShowInfo] = useState(true);

  const handleVagaClick = (numero: number) => {
    navigate(`/vaga/${numero}?action=checkin`);
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 50, marginBottom: 20 }}>🚗</div>
          <div style={{ fontSize: 18, marginBottom: 10 }}>Carregando estacionamento...</div>
          <div style={{ width: 200, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden", margin: "0 auto" }}>
            <div style={{ width: "30%", height: "100%", background: "#3b82f6", animation: "loading 1s ease-in-out infinite" }} />
          </div>
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#0f172a", overflow: "hidden" }}>
      {/* Header Premium */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "12px 24px",
        background: "rgba(15, 23, 42, 0.95)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24
          }}>
            🅿️
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 18 }}>Estacionamento</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Visualização 3D</div>
          </div>
        </div>

        {/* Stats */}
        {status && (
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{
              textAlign: "center",
              padding: "8px 16px",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: 12,
              border: "1px solid rgba(34, 197, 94, 0.2)"
            }}>
              <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 24 }}>{status.vagasLivres}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Livres</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: 12,
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}>
              <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 24 }}>{status.vagasOcupadas}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Ocupadas</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 16px",
              background: "rgba(59, 130, 246, 0.1)",
              borderRadius: 12,
              border: "1px solid rgba(59, 130, 246, 0.2)"
            }}>
              <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: 24 }}>{status.totalVagas}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Total</div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500
            }}
          >
            📊 Vista 2D
          </button>
        </div>
      </div>

      {/* Alerta de poucas vagas */}
      {status && status.vagasLivres <= 5 && (
        <div style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 24px",
          background: "rgba(239, 68, 68, 0.2)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: 12,
          color: "#fca5a5",
          textAlign: "center",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "pulse 2s infinite"
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span>Atenção! Apenas <strong>{status.vagasLivres}</strong> vagas disponíveis</span>
        </div>
      )}

      {/* Instruções */}
      {showInfo && (
        <div style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          padding: "16px 20px",
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: 12,
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
          zIndex: 100,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: 280
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: "white" }}>🎮 Controles</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div>🖱️ <strong>Arrastar</strong> - Rotacionar câmera</div>
            <div>🔍 <strong>Scroll</strong> - Zoom in/out</div>
            <div>👆 <strong>Clique</strong> - Selecionar vaga</div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: 16
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Legenda */}
      <div style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: "12px 16px",
        background: "rgba(15, 23, 42, 0.9)",
        borderRadius: 12,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: "white", fontSize: 12 }}>Legenda</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 16, background: "#22c55e", borderRadius: 4 }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Livre</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 16, background: "#ef4444", borderRadius: 4 }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Ocupada</span>
          </div>
        </div>
      </div>

      {/* Cena 3D */}
      <Suspense fallback={
        <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}>
          Carregando 3D...
        </div>
      }>
        <ParkingScene vagas={vagas} onVagaClick={handleVagaClick} />
      </Suspense>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
