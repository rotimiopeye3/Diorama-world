import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveEvents, Preload, BakeShadows } from '@react-three/drei';
import { Bloom, Noise, Vignette, EffectComposer } from '@react-three/postprocessing';
import { Planet } from './Planet';
import { Atmosphere, CelestialSystem } from './Atmosphere';
import { ProgressMonolith } from './ProgressMonolith';
import { LegacySystem } from './WillOTheWisp';
import { useWorldStore } from '../../store/useWorldStore';

export function Scene() {
  const isDay = useWorldStore((state) => state.isDay);

  return (
    <div className="w-full h-full bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [15, 15, 15], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        <color attach="background" args={[isDay ? '#0c0a09' : '#020617']} />
        
        {/* Global Environment */}
        <ambientLight intensity={isDay ? 0.2 : 0.05} />
        <Atmosphere />
        <CelestialSystem />
        
        <group>
          <Planet />
          <ProgressMonolith />
          <LegacySystem />
        </group>

        <OrbitControls 
          enablePan={false} 
          minDistance={8} 
          maxDistance={40} 
          makeDefault
        />

        <EffectComposer>
          <Bloom 
            luminanceThreshold={isDay ? 1.0 : 0.1} 
            mipmapBlur 
            intensity={isDay ? 0.5 : 2.0} 
            radius={0.4} 
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        <AdaptiveEvents />
        <Preload all />
        <BakeShadows />
      </Canvas>
    </div>
  );
}

