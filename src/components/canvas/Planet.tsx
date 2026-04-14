import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorldStore } from '../../store/useWorldStore';
import { PlanetMaterial } from '../../lib/shaders';

export function Planet() {
  const materialRef = useRef<any>(null);
  const { isDay, powerLevel } = useWorldStore();
  const material = useMemo(() => new PlanetMaterial(), []);

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
    <group>
      {/* The Planet Sphere */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[5, 64]} />
        <primitive object={material} ref={materialRef} />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial 
          color={isDay ? "#60a5fa" : "#1e40af"} 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide} 
        />
      </mesh>

      {/* Scattered Houses */}
      <Houses />
    </group>
  );
}

function Houses() {
  const { isDay } = useWorldStore();
  const houseCount = 20;
  
  const housePositions = useMemo(() => {
    return Array.from({ length: houseCount }, () => {
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = 2 * Math.PI * Math.random();
      const radius = 5.2; // Slightly above planet surface
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    });
  }, []);

  return (
    <group>
      {housePositions.map((pos, i) => (
        <group key={i} position={pos} lookAt={[0, 0, 0] as any}>
          {/* House Base */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={isDay ? "#fef3c7" : "#451a03"} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.25, 0.3, 4]} />
            <meshStandardMaterial color={isDay ? "#ef4444" : "#7f1d1d"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
