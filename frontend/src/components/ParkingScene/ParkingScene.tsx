import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Plane, Cylinder, Grid, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { Vaga } from "../../types";

interface ParkingSceneProps {
  vagas: Vaga[];
  onVagaClick: (numero: number) => void;
  colorPalette?: ColorPalette;
  effectsEnabled?: boolean;
}

interface ColorPalette {
  floor: string;
  walls: string;
  freeSpot: string;
  occupiedSpot: string;
  car: string;
  accent: string;
  ambient: string;
}

const defaultPalette: ColorPalette = {
  floor: "#1a1a2e",
  walls: "#16213e",
  freeSpot: "#0f3460",
  occupiedSpot: "#e94560",
  car: "#533483",
  accent: "#00fff5",
  ambient: "#1a1a2e"
};

// Carro Low-poly
function Car({ color = "#533483", onClick }: { color?: string; onClick?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.7, 1.1]} />
        <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
      
      <Box args={[0.65, 0.18, 1.05]} position={[0, 0.18, 0]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
      
      <Box args={[0.55, 0.14, 0.55]} position={[0, 0.33, -0.08]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
      
      <Box args={[0.52, 0.1, 0.48]} position={[0, 0.35, -0.08]}>
        <meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </Box>
      
      {[-0.22, 0.22].map((x, i) => (
        <Box key={i} args={[0.12, 0.06, 0.02]} position={[x, 0.16, 0.53]}>
          <meshStandardMaterial color="#fffbe6" emissive="#fffbe6" emissiveIntensity={hovered ? 2 : 0.8} />
        </Box>
      ))}
      
      {[-0.22, 0.22].map((x, i) => (
        <Box key={i} args={[0.12, 0.05, 0.02]} position={[x, 0.16, -0.53]}>
          <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.6} />
        </Box>
      ))}
      
      {[[-0.32, 0.08, 0.35], [0.32, 0.08, 0.35], [-0.32, 0.08, -0.35], [0.32, 0.08, -0.35]].map((pos, i) => (
        <Cylinder key={i} args={[0.09, 0.09, 0.06, 8]} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Cylinder>
      ))}
    </group>
  );
}

// Vaga
function Vaga3D({ vaga, position, onClick, palette }: { 
  vaga: Vaga; 
  position: [number, number, number]; 
  onClick: () => void;
  palette: ColorPalette;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      const targetY = hovered ? 0.15 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + position[1], 0.1);
    }
  });

  const spotColor = vaga.ocupada ? palette.occupiedSpot : palette.freeSpot;
  const hora = vaga.horaEntrada ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[0.9, 0.02, 1.6]} position={[0, 0, 0]}>
        <meshStandardMaterial color={spotColor} metalness={0.2} roughness={0.8} />
      </Box>
      
      <Box args={[0.03, 0.025, 1.4]} position={[-0.4, 0.015, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.03, 0.025, 1.4]} position={[0.4, 0.015, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      
      <Text position={[0, 0.1, 0]} fontSize={0.18} color="white" anchorX="center" anchorY="middle" fontWeight="bold">
        {vaga.numero.toString().padStart(2, "0")}
      </Text>

      {vaga.ocupada && <Float speed={2} rotationIntensity={0} floatIntensity={0.1}><Car color={palette.car} /></Float>}

      {!vaga.ocupada && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.8} />
        </mesh>
      )}

      {hovered && vaga.ocupada && (
        <group position={[0, 1.5, 0]}>
          <Plane args={[1.4, 0.6]} rotation={[0, 0, 0]}>
            <meshBasicMaterial color="#0a0a0a" transparent opacity={0.9} />
          </Plane>
          <Text position={[0, 0.1, 0]} fontSize={0.14} color="white" anchorX="center" fontWeight="bold">
            {vaga.nomeUsuario}
          </Text>
          {hora && <Text position={[0, -0.1, 0]} fontSize={0.11} color={palette.accent} anchorX="center">⏱ {hora}</Text>}
        </group>
      )}
    </group>
  );
}

function Floor({ palette }: { palette: ColorPalette }) {
  return (
    <group position={[0, -0.01, 0]}>
      <Plane args={[35, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={palette.floor} />
      </Plane>
      <Grid args={[35, 25]} cellSize={1} cellThickness={0.3} cellColor="#2a2a4a" sectionSize={5} sectionThickness={0.5} sectionColor="#3a3a5a" fadeDistance={40} position={[0, 0.01, 0]} />
    </group>
  );
}

function Walls({ palette }: { palette: ColorPalette }) {
  return (
    <group>
      <Box args={[36, 2, 0.3]} position={[0, 1, -12]}><meshStandardMaterial color={palette.walls} /></Box>
      <Box args={[36, 2, 0.3]} position={[0, 1, 12]}><meshStandardMaterial color={palette.walls} /></Box>
      <Box args={[0.3, 2, 25]} position={[-18, 1, 0]}><meshStandardMaterial color={palette.walls} /></Box>
      <Box args={[0.3, 2, 25]} position={[18, 1, 0]}><meshStandardMaterial color={palette.walls} /></Box>
    </group>
  );
}

function GateHouse({ palette }: { palette: ColorPalette }) {
  return (
    <group position={[-14, 0, 0]}>
      <Box args={[3, 0.1, 3]} position={[0, 0.05, 0]}><meshStandardMaterial color="#1a1a2e" /></Box>
      <Box args={[2.5, 2.5, 2.5]} position={[0, 1.35, 0]}><meshStandardMaterial color={palette.accent} metalness={0.3} roughness={0.7} /></Box>
      <Box args={[2.8, 0.2, 2.8]} position={[0, 2.75, 0]}><meshStandardMaterial color="#0a0a1a" /></Box>
      <Text position={[0, 3.2, 0]} fontSize={0.28} color="white" anchorX="center">🏠 GUARITA</Text>
      <pointLight position={[0, 2, 0]} intensity={0.5} color={palette.accent} distance={5} />
    </group>
  );
}

function Corridor() {
  return (
    <group position={[0, 0.005, 0]}>
      <Plane args={[28, 2.5]} rotation={[-Math.PI / 2, 0, 0]}><meshStandardMaterial color="#0a0a1a" /></Plane>
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <Text key={i} position={[x, 0.01, 0]} fontSize={0.35} color="#f59e0b" anchorX="center" opacity={0.5}>→</Text>
      ))}
    </group>
  );
}

export function ParkingScene({ vagas, onVagaClick, colorPalette = defaultPalette }: ParkingSceneProps) {
  const linha1 = vagas.filter(v => v.numero >= 1 && v.numero <= 25);
  const linha2 = vagas.filter(v => v.numero >= 26 && v.numero <= 50);

  return (
    <Canvas camera={{ position: [0, 20, 30], fov: 45 }} shadows style={{ height: "85vh", background: "linear-gradient(to bottom, #0a0a1a, #1a1a2e)" }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 40, 20]} intensity={1.2} castShadow />
      <pointLight position={[-15, 8, 0]} intensity={0.8} color="#00fff5" />
      <pointLight position={[15, 8, 0]} intensity={0.8} color="#ff00ff" />
      <fog attach="fog" args={["#0a0a1a", 25, 70]} />

      <Floor palette={colorPalette} />
      <Walls palette={colorPalette} />
      <GateHouse palette={colorPalette} />
      <Corridor />

      <group position={[0, 0, -5]}>
        {linha1.map((vaga, i) => (
          <Vaga3D key={vaga.numero} vaga={vaga} position={[(i - 12) * 1.05, 0, 0]} onClick={() => onVagaClick(vaga.numero)} palette={colorPalette} />
        ))}
      </group>

      <group position={[0, 0, 5]}>
        {linha2.map((vaga, i) => (
          <Vaga3D key={vaga.numero} vaga={vaga} position={[(i - 12) * 1.05, 0, 0]} onClick={() => onVagaClick(vaga.numero)} palette={colorPalette} />
        ))}
      </group>

      <Sparkles count={50} scale={30} size={1} speed={0.2} color={colorPalette.accent} opacity={0.3} />

      <OrbitControls enablePan enableZoom enableRotate minDistance={10} maxDistance={60} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

export { defaultPalette };
export type { ColorPalette };
