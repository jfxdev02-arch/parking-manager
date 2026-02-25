import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Text, Box, Plane, Cylinder, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { Vaga } from "../../types";

interface ParkingSceneProps {
  vagas: Vaga[];
  onVagaClick: (numero: number) => void;
}

// Carro Low-poly estilizado
function Car({ color = "#3b82f6", onClick }: { color?: string; onClick?: () => void }) {
  return (
    <group onClick={onClick}>
      {/* Sombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.6, 1]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>
      
      {/* Corpo principal */}
      <Box args={[0.6, 0.2, 1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Cabine */}
      <Box args={[0.5, 0.15, 0.5]} position={[0, 0.35, -0.1]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Janelas */}
      <Box args={[0.48, 0.1, 0.2]} position={[0, 0.38, 0.05]}>
        <meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </Box>
      <Box args={[0.48, 0.1, 0.2]} position={[0, 0.38, -0.2]}>
        <meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </Box>
      
      {/* Faróis */}
      <Box args={[0.15, 0.08, 0.02]} position={[-0.2, 0.18, 0.5]}>
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
      </Box>
      <Box args={[0.15, 0.08, 0.02]} position={[0.2, 0.18, 0.5]}>
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
      </Box>
      
      {/* Lanternas */}
      <Box args={[0.15, 0.06, 0.02]} position={[-0.2, 0.18, -0.5]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </Box>
      <Box args={[0.15, 0.06, 0.02]} position={[0.2, 0.18, -0.5]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </Box>
      
      {/* Rodas */}
      {[[-0.3, 0.08, 0.35], [0.3, 0.08, 0.35], [-0.3, 0.08, -0.35], [0.3, 0.08, -0.35]].map((pos, i) => (
        <Cylinder key={i} args={[0.08, 0.08, 0.05, 16]} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>
      ))}
    </group>
  );
}

// Vaga 3D melhorada
function Vaga3D({ vaga, position, onClick }: { vaga: Vaga; position: [number, number, number]; onClick: () => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });

  const baseColor = vaga.ocupada ? "#dc2626" : "#22c55e";
  const hora = vaga.horaEntrada 
    ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base da vaga */}
      <Box args={[0.9, 0.02, 1.6]} position={[0, 0, 0]}>
        <meshStandardMaterial color={baseColor} metalness={0.1} roughness={0.8} />
      </Box>
      
      {/* Linhas brancas */}
      <Box args={[0.03, 0.025, 1.4]} position={[-0.4, 0.015, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.03, 0.025, 1.4]} position={[0.4, 0.015, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.85, 0.025, 0.03]} position={[0, 0.015, -0.75]}>
        <meshStandardMaterial color="white" />
      </Box>
      
      {/* Número */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {vaga.numero.toString().padStart(2, "0")}
      </Text>

      {/* Carro se ocupada */}
      {vaga.ocupada && (
        <Car color="#475569" />
      )}

      {/* Tooltip no hover */}
      {hovered && vaga.ocupada && (
        <group position={[0, 1.2, 0]}>
          <Plane args={[1.2, 0.5]} rotation={[0, 0, 0]}>
            <meshBasicMaterial color="#1e293b" transparent opacity={0.9} />
          </Plane>
          <Text position={[0, 0.05, 0]} fontSize={0.12} color="white" anchorX="center">
            {vaga.nomeUsuario}
          </Text>
          {hora && (
            <Text position={[0, -0.12, 0]} fontSize={0.1} color="#94a3b8" anchorX="center">
              ⏱ {hora}
            </Text>
          )}
        </group>
      )}
      
      {/* Indicador de livre */}
      {!vaga.ocupada && (
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Chão do estacionamento com grid
function Floor() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Base */}
      <Plane args={[30, 20]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#334155" />
      </Plane>
      
      {/* Grid lines */}
      <Grid
        args={[30, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#475569"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#64748b"
        fadeDistance={50}
        fadeStrength={1}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

// Muro ao redor
function Walls() {
  return (
    <group>
      {/* Muro traseiro */}
      <Box args={[32, 1.5, 0.3]} position={[0, 0.75, -10]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      {/* Muro frontal */}
      <Box args={[32, 1.5, 0.3]} position={[0, 0.75, 10]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      {/* Muros laterais */}
      <Box args={[0.3, 1.5, 20]} position={[-16, 0.75, 0]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      <Box args={[0.3, 1.5, 20]} position={[16, 0.75, 0]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
    </group>
  );
}

// Guarita melhorada
function GateHouse() {
  return (
    <group position={[-13, 0, 0]}>
      {/* Base */}
      <Box args={[2.5, 0.1, 2.5]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Box>
      
      {/* Estrutura */}
      <Box args={[2, 2, 2]} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.7} />
      </Box>
      
      {/* Telhado */}
      <Box args={[2.3, 0.2, 2.3]} position={[0, 2.3, 0]}>
        <meshStandardMaterial color="#1e40af" />
      </Box>
      
      {/* Janela */}
      <Box args={[0.8, 0.5, 0.05]} position={[0, 1.1, 1.02]}>
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </Box>
      
      {/* Letreiro */}
      <Text position={[0, 2.6, 0]} fontSize={0.25} color="white" anchorX="center" fontWeight="bold">
        GUARITA
      </Text>
      
      {/* Placas de entrada/saída */}
      <group position={[-2.5, 1.5, 0]}>
        <Box args={[0.8, 0.4, 0.05]} />
        <Text position={[0, 0, 0.03]} fontSize={0.12} color="white" anchorX="center">
          ENTRADA →
        </Text>
        <meshStandardMaterial color="#22c55e" />
      </group>
      
      <group position={[2.5, 1.5, 0]}>
        <Box args={[0.8, 0.4, 0.05]} />
        <Text position={[0, 0, 0.03]} fontSize={0.12} color="white" anchorX="center">
          ← SAÍDA
        </Text>
        <meshStandardMaterial color="#f59e0b" />
      </group>
    </group>
  );
}

// Corredor central
function Corridor() {
  return (
    <group position={[0, 0.005, 0]}>
      {/* Corredor */}
      <Plane args={[26, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Plane>
      
      {/* Setas de direção */}
      {[-10, -5, 0, 5, 10].map((x, i) => (
        <Text key={i} position={[x, 0.01, 0]} fontSize={0.3} color="#f59e0b" anchorX="center">
          →
        </Text>
      ))}
    </group>
  );
}

export function ParkingScene({ vagas, onVagaClick }: ParkingSceneProps) {
  const linha1 = vagas.filter(v => v.numero >= 1 && v.numero <= 25);
  const linha2 = vagas.filter(v => v.numero >= 26 && v.numero <= 50);

  return (
    <Canvas
      camera={{ position: [0, 18, 25], fov: 45 }}
      shadows
      style={{ height: "85vh", background: "linear-gradient(to bottom, #1e3a5f, #0f172a)" }}
    >
      {/* Iluminação */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 30, 15]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-10, 5, 0]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[10, 5, 0]} intensity={0.5} color="#8b5cf6" />
      
      {/* Fog */}
      <fog attach="fog" args={["#0f172a", 30, 60]} />
      
      <Floor />
      <Walls />
      <GateHouse />
      <Corridor />
      
      {/* Linha superior - vagas 01-25 */}
      <group position={[0, 0, -4.5]}>
        {linha1.map((vaga, i) => (
          <Vaga3D
            key={vaga.numero}
            vaga={vaga}
            position={[(i - 12) * 1.05, 0, 0]}
            onClick={() => onVagaClick(vaga.numero)}
          />
        ))}
        <Text position={[-13, 0.5, 0]} fontSize={0.2} color="#94a3b8">
          VAGAS 01-25
        </Text>
      </group>

      {/* Linha inferior - vagas 26-50 */}
      <group position={[0, 0, 4.5]}>
        {linha2.map((vaga, i) => (
          <Vaga3D
            key={vaga.numero}
            vaga={vaga}
            position={[(i - 12) * 1.05, 0, 0]}
            onClick={() => onVagaClick(vaga.numero)}
          />
        ))}
        <Text position={[-13, 0.5, 0]} fontSize={0.2} color="#94a3b8">
          VAGAS 26-50
        </Text>
      </group>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.3}
      />
    </Canvas>
  );
}
