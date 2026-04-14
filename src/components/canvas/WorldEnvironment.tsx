import { Sky, ContactShadows, Environment } from '@react-three/drei';
import { useWorldStore } from '../../store/useWorldStore';
import * as THREE from 'three';

export function WorldEnvironment() {
  const isDay = useWorldStore((state) => state.isDay);

  return (
    <>
      {/* Dynamic Sky */}
      <Sky 
        distance={450000} 
        sunPosition={isDay ? [100, 20, 100] : [0, -20, 0]} 
        inclination={0} 
        azimuth={0.25} 
      />

      {/* Fog */}
      <fog attach="fog" args={[isDay ? '#f3f4f6' : '#020617', 5, 25]} />

      {/* Lighting */}
      <ambientLight intensity={isDay ? 0.5 : 0.1} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={isDay ? 1.5 : 0.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {!isDay && (
        <pointLight position={[0, 5, 0]} intensity={2} color="#4338ca" distance={15} />
      )}

      {/* Ground Shadow */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4.5}
      />

      {/* Environment Map */}
      <Environment preset={isDay ? "city" : "night"} />
    </>
  );
}
