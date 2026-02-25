import { useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import { ParkingScene, defaultPalette, type ColorPalette } from "../components/ParkingScene";
import { useEstacionamento } from "../hooks/useEstacionamento";

const palettes: Record<string, ColorPalette> = {
  cyber: { floor: "#0a0a1a", walls: "#1a1a2e", freeSpot: "#0f3460", occupiedSpot: "#e94560", car: "#533483", accent: "#00fff5", ambient: "#1a1a2e" },
  nature: { floor: "#1a2f1a", walls: "#2d4a2d", freeSpot: "#2d5a2d", occupiedSpot: "#8b4513", car: "#556b2f", accent: "#90ee90", ambient: "#1a2f1a" },
  sunset: { floor: "#2d1f2d", walls: "#4a2a4a", freeSpot: "#5a3a5a", occupiedSpot: "#ff6b6b", car: "#8b5a8b", accent: "#ffa500", ambient: "#2d1f2d" },
  midnight: { floor: "#0a0a1a", walls: "#0f0f2a", freeSpot: "#1a1a3a", occupiedSpot: "#4a1a4a", car: "#2a2a4a", accent: "#6366f1", ambient: "#0a0a1a" }
};

export function HomePage3D() {
  const navigate = useNavigate();
  const { vagas, status, loading } = useEstacionamento();
  const [showControls, setShowControls] = useState(true);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalette);
  const [selectedPaletteName, setSelectedPaletteName] = useState<string>("cyber");

  const handleVagaClick = (numero: number) => navigate(\`/vaga/\${numero}?action=checkin\`);
  const handlePaletteChange = (name: string) => { setSelectedPaletteName(name); setCurrentPalette(palettes[name] || defaultPalette); };

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a1a", color: "white" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 50 }}>🚗</div>
          <p style={{ marginTop: 16 }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#0a0a1a", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 20px", background: "rgba(10, 10, 26, 0.9)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #00fff5, #533483)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🅿️</div>
          {showControls && <div><div style={{ color: "white", fontWeight: 600 }}>Estacionamento 3D</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Visualização WebGL</div></div>}
        </div>

        {status && showControls && (
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center", padding: "8px 16px", background: "rgba(34, 197, 94, 0.1)", borderRadius: 10, border: "1px solid rgba(34, 197, 94, 0.3)" }}>
              <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 22 }}>{status.vagasLivres}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>LIVRES</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 16px", background: "rgba(239, 68, 68, 0.1)", borderRadius: 10, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              <div style={{ color: "#f87171", fontWeight: 700, fontSize: 22 }}>{status.vagasOcupadas}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>OCUPADAS</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowControls(!showControls)} style={{ padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", cursor: "pointer" }}>{showControls ? "◀" : "▶"}</button>
          <button onClick={() => navigate("/")} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 12 }}>📊 2D</button>
        </div>
      </div>

      {/* Paletas */}
      {showControls && (
        <div style={{ position: "absolute", top: 80, right: 20, padding: 12, background: "rgba(10, 10, 26, 0.9)", borderRadius: 12, zIndex: 100, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 8 }}>PALETAS</div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.keys(palettes).map((name) => (
              <button key={name} onClick={() => handlePaletteChange(name)} style={{ width: 28, height: 28, background: "linear-gradient(135deg, " + palettes[name].accent + ", " + palettes[name].car + ")", border: selectedPaletteName === name ? "2px solid white" : "2px solid transparent", borderRadius: 6, cursor: "pointer" }} title={name} />
            ))}
          </div>
        </div>
      )}

      {/* Legenda */}
      {showControls && (
        <div style={{ position: "absolute", bottom: 20, right: 20, padding: 12, background: "rgba(10, 10, 26, 0.9)", borderRadius: 12, zIndex: 100, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 14, height: 14, background: "#22c55e", borderRadius: 4 }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Livre</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, background: "#ef4444", borderRadius: 4 }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Ocupada</span>
          </div>
        </div>
      )}

      {/* Controles */}
      {showControls && (
        <div style={{ position: "absolute", bottom: 20, left: 20, padding: 12, background: "rgba(10, 10, 26, 0.9)", borderRadius: 12, zIndex: 100, border: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
          <div>🖱️ Arrastar — Rotacionar</div>
          <div>🔍 Scroll — Zoom</div>
          <div>👆 Clique — Selecionar</div>
        </div>
      )}

      <Suspense fallback={<div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>Carregando 3D...</div>}>
        <ParkingScene vagas={vagas} onVagaClick={handleVagaClick} colorPalette={currentPalette} />
      </Suspense>
    </div>
  );
}
