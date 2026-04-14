import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorldStore } from '../../store/useWorldStore';

export function WillOTheWisp({ index, message }: { index: number; message: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isDay } = useWorldStore();

  const orbitParams = useMemo(() => ({
    radius: 2 + Math.random() * 2,
    speed: 0.5 + Math.random() * 1,
    offset: Math.random() * Math.PI * 2,
    yOffset: Math.random() * 2
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * orbitParams.speed + orbitParams.offset;
    
    meshRef.current.position.x = Math.cos(time) * orbitParams.radius;
    meshRef.current.position.z = Math.sin(time) * orbitParams.radius;
    meshRef.current.position.y = 2 + Math.sin(time * 2) * 0.5 + orbitParams.yOffset;
    
    // Pulse scale
    const scale = 0.1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial 
        color={isDay ? "#fbbf24" : "#60a5fa"} 
        emissive={isDay ? "#fbbf24" : "#60a5fa"}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
      <pointLight 
        color={isDay ? "#fbbf24" : "#60a5fa"} 
        intensity={0.5} 
        distance={3} 
      />
    </mesh>
  );
}

export function LegacySystem() {
  const commits = useWorldStore((state) => state.commits);
  
  return (
    <group>
      {commits.map((msg, i) => (
        <WillOTheWisp key={i} index={i} message={msg} />
      ))}
    </group>
  );
}
