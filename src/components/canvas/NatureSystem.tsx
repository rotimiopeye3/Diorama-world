import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorldStore } from '../../store/useWorldStore';

const GRASS_COUNT = 500;
const TREE_COUNT = 12;

export function NatureSystem() {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const isDay = useWorldStore((state) => state.isDay);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize grass positions
  const grassData = useMemo(() => {
    return Array.from({ length: GRASS_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        0,
        (Math.random() - 0.5) * 8
      ),
      rotation: Math.random() * Math.PI,
      scale: 0.2 + Math.random() * 0.3
    }));
  }, []);

  useFrame((state) => {
    if (!grassRef.current) return;

    const time = state.clock.elapsedTime;
    grassData.forEach((data, i) => {
      const { position, rotation, scale } = data;
      
      // Swaying effect
      const sway = Math.sin(time * 2 + position.x) * 0.1;
      
      dummy.position.copy(position);
      // Adjust Y based on terrain (simplified for now)
      dummy.position.y = -0.8 + Math.sin(position.x * 0.5) * Math.cos(position.z * 0.5) * 0.5 + 
                         Math.sin(position.x * 1.2 + position.z * 0.8) * 0.2;
      
      dummy.rotation.set(sway, rotation, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      grassRef.current!.setMatrixAt(i, dummy.matrix);
    });
    grassRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Grass */}
      <instancedMesh ref={grassRef} args={[undefined, undefined, GRASS_COUNT]}>
        <coneGeometry args={[0.1, 1, 3]} />
        <meshStandardMaterial 
          color={isDay ? "#86efac" : "#1e40af"} 
          flatShading 
        />
      </instancedMesh>

      {/* Spirit Trees */}
      {Array.from({ length: TREE_COUNT }).map((_, i) => {
        const x = (Math.random() - 0.5) * 7;
        const z = (Math.random() - 0.5) * 7;
        const y = -0.8 + Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.5 + 
                  Math.sin(x * 1.2 + z * 0.8) * 0.2;
        
        return (
          <group key={i} position={[x, y, z]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.05, 0.1, 1, 4]} />
              <meshStandardMaterial color={isDay ? "#4b5563" : "#111827"} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <icosahedronGeometry args={[0.4, 0]} />
              <meshStandardMaterial 
                color={isDay ? "#10b981" : "#4338ca"} 
                emissive={isDay ? "#000000" : "#4338ca"}
                emissiveIntensity={isDay ? 0 : 0.5}
                flatShading 
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
