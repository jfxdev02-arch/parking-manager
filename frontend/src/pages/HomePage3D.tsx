import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { ParkingScene } from "../components/ParkingScene";
import { useEstacionamento } from "../hooks/useEstacionamento";

export function HomePage3D() {
  const navigate = useNavigate();
  const { vagas, status, loading } = useEstacionamento();

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
        background: "#0f172a",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>🚗</div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#0f172a" }}>
      {/* Header */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "15px 20px",
        background: "rgba(15, 23, 42, 0.9)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
        backdropFilter: "blur(10px)"
      }}>
        <h1 style={{ color: "white", fontSize: 20, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          🅿️ Estacionamento 3D
        </h1>
        
        {status && (
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#22c55e", fontWeight: "bold", fontSize: 20 }}>{status.vagasLivres}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>LIVRES</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#ef4444", fontWeight: "bold", fontSize: 20 }}>{status.vagasOcupadas}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>OCUPADAS</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#3b82f6", fontWeight: "bold", fontSize: 20 }}>{status.totalVagas}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>TOTAL</div>
            </div>
          </div>
        )}
      </div>

      {/* Instruções */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        zIndex: 100
      }}>
        🖱️ Arraste para rotacionar • Scroll para zoom • Clique na vaga para check-in
      </div>

      {/* Cena 3D */}
      <Suspense fallback={
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
          Carregando 3D...
        </div>
      }>
        <ParkingScene vagas={vagas} onVagaClick={handleVagaClick} />
      </Suspense>
    </div>
  );
}
