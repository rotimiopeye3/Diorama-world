import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { useWorldStore } from '../../store/useWorldStore';
import { AuroraMaterial } from '../../lib/shaders';

export function Atmosphere() {
  const { isDay } = useWorldStore();
  const auroraRef = useRef<any>(null);
  const auroraMaterial = useMemo(() => new AuroraMaterial(), []);

  useFrame((state) => {
    if (auroraRef.current) {
      auroraRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <>
      {/* Stars - always there but more visible at night */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />

      {/* Aurora Borealis */}
      {!isDay && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[15, 15, 10, 64, 1, true]} />
          <primitive 
            object={auroraMaterial} 
            ref={auroraRef} 
            transparent 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}
    </>
  );
}

export function CelestialSystem() {
  const { isDay } = useWorldStore();
  const sunRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={sunRef}>
      {/* Sun */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[25, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={isDay ? 2 : 0.1} 
          />
          <pointLight intensity={isDay ? 5 : 0.1} color="#fbbf24" distance={100} />
        </mesh>
      </Float>

      {/* Moon */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[-25, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#94a3b8" 
            emissive="#94a3b8" 
            emissiveIntensity={isDay ? 0.1 : 1} 
          />
          <pointLight intensity={isDay ? 0.1 : 2} color="#94a3b8" distance={50} />
        </mesh>
      </Float>
    </group>
  );
}
