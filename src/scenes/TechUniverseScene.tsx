import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  PerspectiveCamera,
  ContactShadows,
  Image,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

type Props = {
  progress: number;
  activeSection: number;
  accentColor: string;
  onCardClick: (index: number) => void;
};

const images = [
  "/gate.jpg",
  "/aftermovie_22_23.png",
  "/aftermovie_23_24.png"
];

function ImageCard({
  url,
  index,
  rotationY,
  progress,
  accentColor,
  onClick
}: {
  url: string;
  index: number;
  rotationY: number;
  progress: number;
  accentColor: string;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  
  // Compute this card's angle around the carousel
  const cardAngle = index * ((Math.PI * 2) / 3);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();
    
    // The current angle is the card's base angle plus the carousel's rotation
    const currentAngle = cardAngle + rotationY;

    // Radius of the carousel
    const R = 5.8;

    // Position around the Y-axis ring (center pushed to z = -3.2)
    const x = Math.sin(currentAngle) * R;
    const z = Math.cos(currentAngle) * R - 3.2;
    const y = Math.sin(t * 0.8 + index * 2) * 0.08; // very gentle float

    // Smooth position lerp
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x, 0.08);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, z, 0.08);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y, 0.08);

    // Calculate how close the card is to the front (cos(currentAngle) = 1 is closest)
    const cosAngle = Math.cos(currentAngle);
    // frontFactor goes from 0 (at the back) to 1 (directly in front of the camera)
    const frontFactor = Math.max(0, (cosAngle + 0.5) / 1.5);

    // Mouse reaction: hover tilt (only effective if card is relatively in front)
    const mx = state.pointer.x;
    const my = state.pointer.y;
    const tiltX = my * 0.12 * frontFactor;
    const tiltY = -mx * 0.12 * frontFactor;

    // Rotate cards to face the center, plus mouse tilt
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, currentAngle + tiltY, 0.08);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, tiltX, 0.08);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, Math.sin(t * 0.25 + index) * 0.005, 0.08);

    // Dynamic scale: scale up when card is in the front focus
    const targetScale = 1.0 + frontFactor * 0.2;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.08));
  });

  return (
    <group
      ref={ref}
      onClick={onClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <Float speed={0.8} rotationIntensity={0.01} floatIntensity={0.1}>
        {/* Core Image Panel - rendered directly without outer mesh wrapper to prevent solid white Z-fighting */}
        <Image url={url} transparent opacity={1} toneMapped={false} scale={[7, 4]} />
        
        {/* Hairline elegant border */}
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[7.015, 4.015]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
        </mesh>

        {/* Sleek Dark Backing Plate */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[7.08, 4.08]} />
          <meshBasicMaterial color="#0b0b0f" transparent opacity={0.65} />
        </mesh>
      </Float>
    </group>
  );
}

function MinimalistCore() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.04;
      sphereRef.current.rotation.x = t * 0.02;
    }
  });

  return (
    <group position={[0, -0.5, -3.2]}>
      {/* Abstract Wireframe Sphere representing tech structure */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.015}
        />
      </mesh>
      
      {/* Concentric rings on floor */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.78, 0]}>
        <ringGeometry args={[2.2, 2.215, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.78, 0]}>
        <ringGeometry args={[4.8, 4.815, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
      </mesh>

      {/* Coordinate Grid - very clean and dark */}
      <gridHelper args={[20, 20, '#27272a', '#141416']} position={[0, -2.8, 0]} />
    </group>
  );
}

function ConnectingBeams({ rotationY }: { rotationY: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  // 6 lines: 3 from core to cards, 3 triangle edges connecting cards
  // 6 lines * 2 points/line * 3 floats/point = 36 floats
  const positionsArray = useMemo(() => new Float32Array(36), []);

  // Position coordinates of 3 cards in circular space
  const cardAngles = [0, (Math.PI * 2) / 3, ((Math.PI * 2) * 2) / 3];
  const R = 5.8;

  useFrame(() => {
    if (!lineRef.current || !lineRef.current.geometry) return;
    
    // Draw fine guide lines:
    const cardPositions = cardAngles.map((angle) => {
      const currentAngle = angle + rotationY;
      return new THREE.Vector3(
        Math.sin(currentAngle) * R,
        0,
        Math.cos(currentAngle) * R - 3.2
      );
    });

    const center = new THREE.Vector3(0, -0.5, -3.2);

    let idx = 0;

    // Laser rays from core to card
    cardPositions.forEach((pos) => {
      positionsArray[idx++] = center.x;
      positionsArray[idx++] = center.y;
      positionsArray[idx++] = center.z;
      
      positionsArray[idx++] = pos.x;
      positionsArray[idx++] = pos.y;
      positionsArray[idx++] = pos.z;
    });

    // Outer connecting triangle lines
    for (let i = 0; i < 3; i++) {
      const p1 = cardPositions[i];
      const p2 = cardPositions[(i + 1) % 3];
      
      positionsArray[idx++] = p1.x;
      positionsArray[idx++] = p1.y;
      positionsArray[idx++] = p1.z;
      
      positionsArray[idx++] = p2.x;
      positionsArray[idx++] = p2.y;
      positionsArray[idx++] = p2.z;
    }

    const posAttr = lineRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    if (posAttr) {
      posAttr.copyArray(positionsArray);
      posAttr.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsArray, 3]}
        />
      </bufferGeometry>
      {/* Subtle silver hairline guides */}
      <lineBasicMaterial color="#ffffff" transparent opacity={0.03} linewidth={1} />
    </lineSegments>
  );
}

function TechParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 600;
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Cylinder distribution around the carousel
      const theta = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 11;
      pos[i * 3] = Math.sin(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = Math.cos(theta) * r - 3.2;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.01; // very slow drift
    ref.current.position.y = Math.sin(t * 0.15) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012} /* Tiny elegant dust particles */
        color="#ffffff"
        transparent
        opacity={0.12}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CinematicGallery({
  progress,
  accentColor,
  onCardClick
}: {
  progress: number;
  accentColor: string;
  onCardClick: (index: number) => void;
}) {
  const rotationRef = useRef(0);

  // Smooth carousel rotation lerping
  const targetRotation = -progress * Math.PI * 2;
  
  useFrame(() => {
    rotationRef.current = THREE.MathUtils.lerp(
      rotationRef.current,
      targetRotation,
      0.06
    );
  });

  return (
    <group>
      {/* 3D Glass Image Panels */}
      {images.map((url, i) => (
        <ImageCard
          key={i}
          url={url}
          index={i}
          rotationY={rotationRef.current}
          progress={progress}
          accentColor={accentColor}
          onClick={() => onCardClick(i)}
        />
      ))}
      
      {/* Minimalist Wireframe Sphere and floor rings */}
      <MinimalistCore />

      {/* Cyber energy connecting network beams */}
      <ConnectingBeams rotationY={rotationRef.current} />
    </group>
  );
}

function CustomCamera({ activeSection }: { activeSection: number }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (!camRef.current) return;
    
    // Zoom out camera slightly at Section 3 (the Network Phase) to reveal the complete delta triangle system
    const targetZ = activeSection === 3 ? 15.0 : 11.0;
    camRef.current.position.z = THREE.MathUtils.lerp(
      camRef.current.position.z,
      targetZ,
      0.05
    );
    
    // Subtle breathing camera movement
    camRef.current.position.y = THREE.MathUtils.lerp(
      camRef.current.position.y,
      Math.sin(performance.now() * 0.0005) * 0.06,
      0.05
    );
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 11]} fov={45} />;
}

export function TechUniverseScene({ progress, activeSection, accentColor, onCardClick }: Props) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, stencil: false, depth: true }}>
      <Suspense fallback={null}>
        <CustomCamera activeSection={activeSection} />
        
        {/* Dynamic Space Particle Vortex */}
        <TechParticles />

        {/* Circular Cinematic Gallery */}
        <CinematicGallery progress={progress} accentColor={accentColor} onCardClick={onCardClick} />
        
        {/* Cinematic Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
        <directionalLight position={[0, 5, 5]} intensity={0.4} color="#ffffff" />
        
        <Environment preset="night" />
        <ContactShadows opacity={0.12} scale={35} blur={2.0} far={6} color="#000000" position={[0, -3.5, -2.5]} />
        
        {/* Post-Processing Effects for Breathtaking Glows */}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.2} luminanceThreshold={0.9} mipmapBlur radius={0.4} />
          <Vignette eskil={false} offset={0.15} darkness={0.9} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
