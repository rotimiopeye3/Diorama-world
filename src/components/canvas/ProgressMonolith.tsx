import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { useWorldStore } from '../../store/useWorldStore';
import { MonolithMaterial } from '../../lib/shaders';

export function ProgressMonolith() {
  const materialRef = useRef<any>(null);
  const { powerLevel, isDay } = useWorldStore();

  const material = useMemo(() => new MonolithMaterial(), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uPower = powerLevel;
      materialRef.current.uDayNight = THREE.MathUtils.lerp(
        materialRef.current.uDayNight,
        isDay ? 1.0 : 0.0,
        0.05
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={[0, 2, 0]} castShadow>
        <octahedronGeometry args={[1, 0]} />
        <primitive 
          object={material} 
          ref={materialRef} 
          uColor={new THREE.Color(isDay ? '#4fd1c5' : '#818cf8')}
          transparent
        />
        
        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 pointer-events-none">
            <p className="text-[10px] text-white font-mono uppercase tracking-widest whitespace-nowrap">
              Level: {Math.round(powerLevel * 100)}%
            </p>
          </div>
        </Html>
      </mesh>
    </Float>
  );
}
