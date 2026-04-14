import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { useWorldStore } from '../../store/useWorldStore';

export function Island() {
  const meshRef = useRef<THREE.Mesh>(null);
  const isDay = useWorldStore((state) => state.isDay);

  // Generate low-poly terrain
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, 32, 32);
    geo.rotateX(-Math.PI / 2);
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Simple noise-like displacement
      const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.5 + 
                Math.sin(x * 1.2 + z * 0.8) * 0.2;
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={[0, -1, 0]}>
      {/* Terrain Surface */}
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial 
          color={isDay ? "#4ade80" : "#1e3a8a"} 
          flatShading 
          roughness={0.8}
        />
      </mesh>

      {/* Floating Base */}
      <mesh position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[5, 0, 3, 6]} />
        <meshStandardMaterial 
          color={isDay ? "#71717a" : "#27272a"} 
          flatShading 
        />
      </mesh>

      {/* Water/Mist Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ringGeometry args={[5.2, 6, 32]} />
        <MeshDistortMaterial
          color={isDay ? "#60a5fa" : "#1e40af"}
          speed={2}
          distort={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
