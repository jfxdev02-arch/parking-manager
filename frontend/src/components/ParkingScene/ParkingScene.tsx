import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, Text, Box, Plane, Cylinder, 
  Environment, Grid, useTexture, Float, Sparkles
} from "@react-three/drei";
import { 
  EffectComposer, Bloom, ChromaticAberration, 
  Vignette, DepthOfField, Noise 
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { Vaga } from "../../types";

interface ParkingSceneProps {
  vagas: Vaga[];
  onVagaClick: (numero: number) => void;
  colorPalette?: ColorPalette;
  effectsEnabled?: boolean;
}

// Paleta de cores customizável
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

// ============ SHADERS ============
const spotShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color("#22c55e") },
    pulseIntensity: { value: 0.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float pulseIntensity;
    varying vec2 vUv;
    
    void main() {
      float pulse = sin(time * 2.0) * 0.5 + 0.5;
      float glow = smoothstep(0.5, 0.0, distance(vUv, vec2(0.5))) * pulseIntensity * pulse;
      vec3 finalColor = color + glow;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// ============ CAR MODEL ============
function Car({ color = "#533483", onClick, animated = true }: { 
  color?: string; 
  onClick?: () => void;
  animated?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current && animated) {
      // Animação sutil de "respiração"
      groupRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      // Rotação sutil nas rodas seria aqui
    }
  });

  const scale = hovered ? 1.05 : 1;

  return (
    <group 
      ref={groupRef} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={scale}
    >
      {/* Sombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.7, 1.1]} />
        <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
      
      {/* Corpo - Low Poly Style */}
      <Box args={[0.65, 0.18, 1.05]} position={[0, 0.18, 0]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1}
        />
      </Box>
      
      {/* Cabine */}
      <Box args={[0.55, 0.14, 0.55]} position={[0, 0.33, -0.08]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2}
        />
      </Box>
      
      {/* Janelas - Vidro */}
      <Box args={[0.52, 0.1, 0.48]} position={[0, 0.35, -0.08]}>
        <meshPhysicalMaterial
          color="#87ceeb"
          metalness={0}
          roughness={0}
          transmission={0.9}
          transparent
          opacity={0.3}
        />
      </Box>
      
      {/* Faróis */}
      {[-0.22, 0.22].map((x, i) => (
        <Box key={i} args={[0.12, 0.06, 0.02]} position={[x, 0.16, 0.53]}>
          <meshStandardMaterial 
            color="#fffbe6" 
            emissive="#fffbe6" 
            emissiveIntensity={hovered ? 2 : 0.8}
          />
        </Box>
      ))}
      
      {/* Lanternas */}
      {[-0.22, 0.22].map((x, i) => (
        <Box key={i} args={[0.12, 0.05, 0.02]} position={[x, 0.16, -0.53]}>
          <meshStandardMaterial 
            color="#ff3333" 
            emissive="#ff3333" 
            emissiveIntensity={0.6}
          />
        </Box>
      ))}
      
      {/* Rodas */}
      {[
        [-0.32, 0.08, 0.35],
        [0.32, 0.08, 0.35],
        [-0.32, 0.08, -0.35],
        [0.32, 0.08, -0.35]
      ].map((pos, i) => (
        <Cylinder 
          key={i} 
          args={[0.09, 0.09, 0.06, 8]} 
          position={pos as [number, number, number]} 
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </Cylinder>
      ))}

      {/* Sparkles no hover */}
      {hovered && (
        <Sparkles
          count={20}
          scale={1.5}
          size={2}
          speed={0.5}
          color="#00fff5"
        />
      )}
    </group>
  );
}

// ============ PARKING SPOT ============
function Vaga3D({ 
  vaga, 
  position, 
  onClick,
  palette 
}: { 
  vaga: Vaga; 
  position: [number, number, number]; 
  onClick: () => void;
  palette: ColorPalette;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Hover animation
      const targetY = hovered ? 0.15 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, 
        targetY + position[1], 
        0.1
      );
    }
    
    // Update shader time
    if (materialRef.current && !vaga.ocupada) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const spotColor = vaga.ocupada ? palette.occupiedSpot : palette.freeSpot;
  const hora = vaga.horaEntrada 
    ? new Date(vaga.horaEntrada).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base da vaga com shader */}
      <Box args={[0.9, 0.02, 1.6]} position={[0, 0, 0]}>
        {vaga.ocupada ? (
          <meshStandardMaterial color={spotColor} metalness={0.2} roughness={0.8} />
        ) : (
          <shaderMaterial
            ref={materialRef}
            args={[{
              ...spotShader,
              uniforms: {
                ...spotShader.uniforms,
                color: { value: new THREE.Color(spotColor) }
              }
            }]}
            transparent
          />
        )}
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
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {vaga.numero.toString().padStart(2, "0")}
      </Text>

      {/* Carro se ocupada */}
      {vaga.ocupada && (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.1}>
          <Car color={palette.car} />
        </Float>
      )}

      {/* Indicador luminoso para vagas livres */}
      {!vaga.ocupada && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial 
            color={palette.accent} 
            emissive={palette.accent} 
            emissiveIntensity={0.8}
          />
        </mesh>
      )}

      {/* Tooltip no hover */}
      {hovered && vaga.ocupada && (
        <group position={[0, 1.5, 0]}>
          <Plane args={[1.4, 0.6]} rotation={[0, 0, 0]}>
            <meshBasicMaterial color="#0a0a0a" transparent opacity={0.9} />
          </Plane>
          <Text position={[0, 0.1, 0]} fontSize={0.14} color="white" anchorX="center" fontWeight="bold">
            {vaga.nomeUsuario}
          </Text>
          {hora && (
            <Text position={[0, -0.1, 0]} fontSize={0.11} color={palette.accent} anchorX="center">
              ⏱ {hora}
            </Text>
          )}
        </group>
      )}
    </group>
  );
}

// ============ ENVIRONMENT ============
function Floor({ palette }: { palette: ColorPalette }) {
  return (
    <group position={[0, -0.01, 0]}>
      <Plane args={[35, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={palette.floor} metalness={0.1} roughness={0.9} />
      </Plane>
      
      <Grid
        args={[35, 25]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#2a2a4a"
        sectionSize={5}
        sectionThickness={0.5}
        sectionColor="#3a3a5a"
        fadeDistance={40}
        fadeStrength={1}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

function Walls({ palette }: { palette: ColorPalette }) {
  return (
    <group>
      <Box args={[36, 2, 0.3]} position={[0, 1, -12]}>
        <meshStandardMaterial color={palette.walls} />
      </Box>
      <Box args={[36, 2, 0.3]} position={[0, 1, 12]}>
        <meshStandardMaterial color={palette.walls} />
      </Box>
      <Box args={[0.3, 2, 25]} position={[-18, 1, 0]}>
        <meshStandardMaterial color={palette.walls} />
      </Box>
      <Box args={[0.3, 2, 25]} position={[18, 1, 0]}>
        <meshStandardMaterial color={palette.walls} />
      </Box>
    </group>
  );
}

function GateHouse({ palette }: { palette: ColorPalette }) {
  return (
    <group position={[-14, 0, 0]}>
      <Box args={[3, 0.1, 3]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Box>
      
      <Box args={[2.5, 2.5, 2.5]} position={[0, 1.35, 0]}>
        <meshStandardMaterial color={palette.accent} metalness={0.3} roughness={0.7} />
      </Box>
      
      <Box args={[2.8, 0.2, 2.8]} position={[0, 2.75, 0]}>
        <meshStandardMaterial color="#0a0a1a" />
      </Box>
      
      <Box args={[1, 0.6, 0.05]} position={[0, 1.3, 1.28]}>
        <meshPhysicalMaterial color="#87ceeb" transmission={0.8} roughness={0} />
      </Box>
      
      <Text position={[0, 3.2, 0]} fontSize={0.28} color="white" anchorX="center" fontWeight="bold">
        🏠 GUARITA
      </Text>
      
      {/* Placas */}
      <group position={[-3, 1.5, 0]}>
        <Box args={[1, 0.5, 0.05]} />
        <Text position={[0, 0, 0.03]} fontSize={0.14} color="white" anchorX="center">
          → ENTRADA
        </Text>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
      </group>
      
      <group position={[3, 1.5, 0]}>
        <Box args={[1, 0.5, 0.05]} />
        <Text position={[0, 0, 0.03]} fontSize={0.14} color="white" anchorX="center">
          SAÍDA ←
        </Text>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </group>

      {/* Luz da guarita */}
      <pointLight position={[0, 2, 0]} intensity={0.5} color={palette.accent} distance={5} />
    </group>
  );
}

function Corridor() {
  return (
    <group position={[0, 0.005, 0]}>
      <Plane args={[28, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#0a0a1a" />
      </Plane>
      
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <Text key={i} position={[x, 0.01, 0]} fontSize={0.35} color="#f59e0b" anchorX="center" opacity={0.5}>
          →
        </Text>
      ))}
    </group>
  );
}

// ============ POST PROCESSING ============
function Effects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        intensity={0.5}
      />
      <ChromaticAberration 
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.0005]}
      />
      <Vignette 
        offset={0.3}
        darkness={0.5}
      />
      <Noise 
        opacity={0.02}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}

// ============ CAMERA ANIMATION ============
function CameraController({ cinematic }: { cinematic: boolean }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (cinematic) {
      const t = state.clock.elapsedTime * 0.1;
      camera.position.x = Math.sin(t) * 25;
      camera.position.z = Math.cos(t) * 25;
      camera.position.y = 15 + Math.sin(t * 0.5) * 5;
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

// ============ MAIN SCENE ============
export function ParkingScene({ 
  vagas, 
  onVagaClick,
  colorPalette = defaultPalette,
  effectsEnabled = true
}: ParkingSceneProps) {
  const [cinematic, setCinematic] = useState(false);
  
  const linha1 = vagas.filter(v => v.numero >= 1 && v.numero <= 25);
  const linha2 = vagas.filter(v => v.numero >= 26 && v.numero <= 50);

  return (
    <Canvas
      camera={{ position: [0, 20, 30], fov: 45 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ height: "85vh", background: "linear-gradient(to bottom, #0a0a1a, #1a1a2e)" }}
    >
      {/* Iluminação cinematográfica */}
      <ambientLight intensity={0.3} color={colorPalette.ambient} />
      
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        color="#fffbe6"
      />
      
      <pointLight position={[-15, 8, 0]} intensity={0.8} color="#00fff5" />
      <pointLight position={[15, 8, 0]} intensity={0.8} color="#ff00ff" />
      <pointLight position={[0, 10, 15]} intensity={0.5} color="#ffaa00" />
      
      {/* Fog para profundidade */}
      <fog attach="fog" args={["#0a0a1a", 25, 70]} />

      {/* Ambiente */}
      <Floor palette={colorPalette} />
      <Walls palette={colorPalette} />
      <GateHouse palette={colorPalette} />
      <Corridor />
      
      {/* Linha superior - vagas 01-25 */}
      <group position={[0, 0, -5]}>
        {linha1.map((vaga, i) => (
          <Vaga3D
            key={vaga.numero}
            vaga={vaga}
            position={[(i - 12) * 1.05, 0, 0]}
            onClick={() => onVagaClick(vaga.numero)}
            palette={colorPalette}
          />
        ))}
        <Text position={[-14, 0.5, 0]} fontSize={0.22} color="#666" opacity={0.6}>
          01-25
        </Text>
      </group>

      {/* Linha inferior - vagas 26-50 */}
      <group position={[0, 0, 5]}>
        {linha2.map((vaga, i) => (
          <Vaga3D
            key={vaga.numero}
            vaga={vaga}
            position={[(i - 12) * 1.05, 0, 0]}
            onClick={() => onVagaClick(vaga.numero)}
            palette={colorPalette}
          />
        ))}
        <Text position={[-14, 0.5, 0]} fontSize={0.22} color="#666" opacity={0.6}>
          26-50
        </Text>
      </group>

      {/* Partículas ambiente */}
      <Sparkles
        count={50}
        scale={30}
        size={1}
        speed={0.2}
        color={colorPalette.accent}
        opacity={0.3}
      />

      {/* Controles */}
      <OrbitControls
        enablePan={!cinematic}
        enableZoom={!cinematic}
        enableRotate={!cinematic}
        minDistance={10}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.2}
        dampingFactor={0.05}
        enableDamping
      />
      
      {/* Efeitos pós-processamento */}
      <Effects enabled={effectsEnabled} />
      
      {/* Câmera cinematográfica */}
      <CameraController cinematic={cinematic} />
    </Canvas>
  );
}

export { defaultPalette };
export type { ColorPalette };
