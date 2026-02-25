import { useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import { ParkingScene, defaultPalette, type ColorPalette } from "../components/ParkingScene";
import { useEstacionamento } from "../hooks/useEstacionamento";

// Paletas predefinidas
const palettes: Record<string, ColorPalette> = {
  cyber: {
    floor: "#0a0a1a",
    walls: "#1a1a2e",
    freeSpot: "#0f3460",
    occupiedSpot: "#e94560",
    car: "#533483",
    accent: "#00fff5",
    ambient: "#1a1a2e"
  },
  nature: {
    floor: "#1a2f1a",
    walls: "#2d4a2d",
    freeSpot: "#2d5a2d",
    occupiedSpot: "#8b4513",
    car: "#556b2f",
    accent: "#90ee90",
    ambient: "#1a2f1a"
  },
  sunset: {
    floor: "#2d1f2d",
    walls: "#4a2a4a",
    freeSpot: "#5a3a5a",
    occupiedSpot: "#ff6b6b",
    car: "#8b5a8b",
    accent: "#ffa500",
    ambient: "#2d1f2d"
  },
  midnight: {
    floor: "#0a0a1a",
    walls: "#0f0f2a",
    freeSpot: "#1a1a3a",
    occupiedSpot: "#4a1a4a",
    car: "#2a2a4a",
    accent: "#6366f1",
    ambient: "#0a0a1a"
  }
};

export function HomePage3D() {
  const navigate = useNavigate();
  const { vagas, status, loading } = useEstacionamento();
  
  // Estados de UI
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalette);
  const [selectedPaletteName, setSelectedPaletteName] = useState<string>("cyber");

  const handleVagaClick = (numero: number) => {
    navigate(`/vaga/${numero}?action=checkin`);
  };

  const handlePaletteChange = (name: string) => {
    setSelectedPaletteName(name);
    setCurrentPalette(palettes[name] || defaultPalette);
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a1a, #1a1a2e)",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: 60, 
            marginBottom: 20,
            animation: "pulse 1.5s ease-in-out infinite"
          }}>🚗</div>
          <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: 2, marginBottom: 20 }}>
            CARREGANDO ESTACIONAMENTO
          </div>
          <div style={{ 
            width: 200, 
            height: 2, 
            background: "rgba(255,255,255,0.1)", 
            borderRadius: 1, 
            overflow: "hidden", 
            margin: "0 auto" 
          }}>
            <div style={{ 
              width: "40%", 
              height: "100%", 
              background: "linear-gradient(90deg, #00fff5, #ff00ff)", 
              animation: "loading 1.2s ease-in-out infinite" 
            }} />
          </div>
        </div>
        <style>{`
          @keyframes loading { 
            0% { transform: translateX(-150%); } 
            100% { transform: translateX(350%); } 
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#0a0a1a", overflow: "hidden" }}>
      {/* Header Minimal */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: showControls ? "16px 24px" : "12px 24px",
        background: "rgba(10, 10, 26, 0.9)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
        backdropFilter: "blur(20px)",
        borderBottom: showControls ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s ease"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            background: `linear-gradient(135deg, ${currentPalette.accent}, ${currentPalette.car})`,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            boxShadow: `0 4px 20px ${currentPalette.accent}40`
          }}>
            🅿️
          </div>
          {showControls && (
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 18 }}>Estacionamento</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 1 }}>VISUALIZAÇÃO 3D</div>
            </div>
          )}
        </div>

        {/* Stats */}
        {status && showControls && (
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{
              textAlign: "center",
              padding: "10px 20px",
              background: `linear-gradient(135deg, ${currentPalette.freeSpot}40, ${currentPalette.freeSpot}20)`,
              borderRadius: 12,
              border: `1px solid ${currentPalette.freeSpot}60`
            }}>
              <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 26 }}>{status.vagasLivres}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: 2 }}>Livres</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "10px 20px",
              background: `linear-gradient(135deg, ${currentPalette.occupiedSpot}40, ${currentPalette.occupiedSpot}20)`,
              borderRadius: 12,
              border: `1px solid ${currentPalette.occupiedSpot}60`
            }}>
              <div style={{ color: "#f87171", fontWeight: 700, fontSize: 26 }}>{status.vagasOcupadas}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: 2 }}>Ocupadas</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "10px 20px",
              background: `linear-gradient(135deg, ${currentPalette.accent}30, ${currentPalette.accent}10)`,
              borderRadius: 12,
              border: `1px solid ${currentPalette.accent}40`
            }}>
              <div style={{ color: currentPalette.accent, fontWeight: 700, fontSize: 26 }}>{status.totalVagas}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: 2 }}>Total</div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowControls(!showControls)}
            style={{
              padding: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "white",
              cursor: "pointer",
              fontSize: 16
            }}
            title="Toggle UI"
          >
            {showControls ? "◀" : "▶"}
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "white",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500
            }}
          >
            📊 2D
          </button>
        </div>
      </div>

      {/* Painel de Controles */}
      {showControls && (
        <div style={{
          position: "absolute",
          top: 90,
          right: 20,
          padding: 16,
          background: "rgba(10, 10, 26, 0.95)",
          borderRadius: 16,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.05)",
          width: 200
        }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: "white", fontSize: 12, letterSpacing: 1 }}>
            ⚙️ CONTROLES
          </div>
          
          {/* Toggle Efeitos */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Efeitos Visuais</span>
              <button
                onClick={() => setEffectsEnabled(!effectsEnabled)}
                style={{
                  width: 36,
                  height: 20,
                  background: effectsEnabled ? currentPalette.accent : "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s"
                }}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: 2,
                  left: effectsEnabled ? 18 : 2,
                  transition: "all 0.2s"
                }} />
              </button>
            </div>
          </div>

          {/* Modo Cinematográfico */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Cinematográfico</span>
              <button
                onClick={() => setCinematicMode(!cinematicMode)}
                style={{
                  width: 36,
                  height: 20,
                  background: cinematicMode ? "#f59e0b" : "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s"
                }}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: 2,
                  left: cinematicMode ? 18 : 2,
                  transition: "all 0.2s"
                }} />
              </button>
            </div>
          </div>

          {/* Paletas de Cores */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 8 }}>Paleta de Cores</div>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.keys(palettes).map((name) => (
                <button
                  key={name}
                  onClick={() => handlePaletteChange(name)}
                  style={{
                    width: 32,
                    height: 32,
                    background: `linear-gradient(135deg, ${palettes[name].accent}, ${palettes[name].car})`,
                    border: selectedPaletteName === name ? "2px solid white" : "2px solid transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  title={name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerta */}
      {status && status.vagasLivres <= 5 && showControls && (
        <div style={{
          position: "absolute",
          top: 90,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 28px",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: 50,
          color: "#fca5a5",
          textAlign: "center",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span>Apenas <strong>{status.vagasLivres}</strong> vagas disponíveis</span>
        </div>
      )}

      {/* Instruções */}
      {showInfo && showControls && (
        <div style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          padding: "14px 18px",
          background: "rgba(10, 10, 26, 0.95)",
          borderRadius: 14,
          color: "rgba(255,255,255,0.7)",
          fontSize: 11,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.05)",
          maxWidth: 220
        }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "white", fontSize: 11, letterSpacing: 1 }}>
            🎮 CONTROLES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div>🖱️ <strong>Arrastar</strong> — Rotacionar</div>
            <div>🔍 <strong>Scroll</strong> — Zoom</div>
            <div>👆 <strong>Clique</strong> — Selecionar vaga</div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: 14
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Legenda */}
      {showControls && (
        <div style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          padding: "14px 18px",
          background: "rgba(10, 10, 26, 0.95)",
          borderRadius: 14,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "white", fontSize: 11, letterSpacing: 1 }}>
            LEGENDA
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ 
                width: 18, 
                height: 18, 
                background: `linear-gradient(135deg, ${currentPalette.freeSpot}, ${currentPalette.accent})`, 
                borderRadius: 5,
                boxShadow: `0 0 10px ${currentPalette.accent}60`
              }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Livre</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ 
                width: 18, 
                height: 18, 
                background: `linear-gradient(135deg, ${currentPalette.occupiedSpot}, #ff3333)`, 
                borderRadius: 5 
              }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Ocupada</span>
            </div>
          </div>
        </div>
      )}

      {/* Cena 3D */}
      <Suspense fallback={
        <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎬</div>
            <div>Preparando cena 3D...</div>
          </div>
        </div>
      }>
        <ParkingScene 
          vagas={vagas} 
          onVagaClick={handleVagaClick}
          colorPalette={currentPalette}
          effectsEnabled={effectsEnabled}
        />
      </Suspense>
    </div>
  );
}
