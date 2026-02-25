import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box } from "@react-three/drei";
import * as THREE from "three";
import type { Vaga } from "../../types";

interface ParkingSceneProps {
  vagas: Vaga[];
  onVagaClick: (numero: number) => void;
}

// Componente de vaga 3D
function Vaga3D({ vaga, position, onClick }: { vaga: Vaga; position: [number, number, number]; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animação de hover
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + vaga.numero) * 0.02;
    }
  });

  const color = vaga.ocupada ? "#dc2626" : "#22c55e";
  const hora = vaga.horaEntrada 
    ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <group position={position}>
      {/* Base da vaga */}
      <Box
        ref={meshRef}
        args={[0.8, 0.05, 1.4]}
        position={[0, 0, 0]}
        onClick={onClick}
      >
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </Box>
      
      {/* Linhas brancas */}
      <Box args={[0.02, 0.06, 1.2]} position={[-0.35, 0.03, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.02, 0.06, 1.2]} position={[0.35, 0.03, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      
      {/* Número da vaga */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {vaga.numero.toString().padStart(2, "0")}
      </Text>

      {/* Carro se ocupada */}
      {vaga.ocupada && (
        <group position={[0, 0.15, 0]}>
          {/* Corpo do carro */}
          <Box args={[0.5, 0.15, 0.8]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
          </Box>
          {/* Teto */}
          <Box args={[0.4, 0.1, 0.4]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
          </Box>
          {/* Rodas */}
          <Box args={[0.1, 0.1, 0.1]} position={[-0.3, 0.05, 0.3]} />
          <Box args={[0.1, 0.1, 0.1]} position={[0.3, 0.05, 0.3]} />
          <Box args={[0.1, 0.1, 0.1]} position={[-0.3, 0.05, -0.3]} />
          <Box args={[0.1, 0.1, 0.1]} position={[0.3, 0.05, -0.3]} />
        </group>
      )}
    </group>
  );
}

// Chão do estacionamento
function Floor() {
  return (
    <Box args={[30, 0.1, 15]} position={[0, -0.1, 0]}>
      <meshStandardMaterial color="#1e293b" />
    </Box>
  );
}

// Corredor
function Corridor() {
  return (
    <Box args={[28, 0.02, 2]} position={[0, 0.01, 0]}>
      <meshStandardMaterial color="#0f172a" />
    </Box>
  );
}

// Guarita
function GateHouse() {
  return (
    <group position={[-12, 0, 0]}>
      <Box args={[2, 1.5, 1.5]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.7} />
      </Box>
      <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center">
        🏠 GUARITA
      </Text>
    </group>
  );
}

export function ParkingScene({ vagas, onVagaClick }: ParkingSceneProps) {
  const linha1 = vagas.filter(v => v.numero >= 1 && v.numero <= 25);
  const linha2 = vagas.filter(v => v.numero >= 26 && v.numero <= 50);

  return (
    <Canvas
      camera={{ position: [0, 15, 20], fov: 50 }}
      style={{ height: "80vh", background: "linear-gradient(to bottom, #0f172a, #1e293b)" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#3b82f6" />
      
      <Floor />
      <GateHouse />
      
      {/* Linha superior - vagas 01-25 */}
      <group position={[0, 0, -4]}>
        {linha1.map((vaga, i) => (
          <Vaga3D
            key={vaga.numero}
            vaga={vaga}
            position={[(i - 12) * 1, 0, 0]}
            onClick={() => onVagaClick(vaga.numero)}
          />
        ))}
      </group>

      <Corridor />

      {/* Linha inferior - vagas 26-50 */}
      <group position={[0, 0, 4]}>
        {linha2.map((vaga, i) => (
          <Vaga3D
            key={vaga.numero}
            vaga={vaga}
            position={[(i - 12) * 1, 0, 0]}
            onClick={() => onVagaClick(vaga.numero)}
          />
        ))}
      </group>

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
