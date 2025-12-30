'use client';

/**
 * HeroScene - Главный контейнер для 3D Canvas
 * @module components/vault-hero/HeroScene
 *
 * ✅ Этап 4: Подключен useVaultEvents для mousemove
 * TODO Этап 6: Добавить LaserFlow
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Grid } from '@react-three/drei';
import { Vault } from './Vault';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';
import { useVaultEvents } from '@/hooks/useVaultEvents';
import { useVaultScroll } from '@/hooks/useVaultScroll';
import LaserFlow from './LaserBeam';
import { useVaultStore } from '@/lib/stores/vault-store';

/** Loading fallback для 3D сцены */
function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#1b1f2a" wireframe />
    </mesh>
  );
}

function HeroScene() {
  // ✅ Этап 4: Подключен useVaultEvents для обработки mousemove
  useVaultEvents();
  // ✅ Этап 5: Подключен useVaultScroll для обработки скролла
  useVaultScroll();

  const vaultOffset = useVaultStore((state) => state.vaultOffset);
  const mouse = useVaultStore((state) => state.mouse);

  return (
    <div
      className="h-screen w-full relative bg-[#0a0e1a]" // Убрал overflow-hidden
      id="vault-hero"
      style={
        {
          '--mx': `${(mouse.x + 1) * 50}%`,
          '--my': `${(1 - mouse.y) * 50}%`,
        } as React.CSSProperties
      }
    >
      {/* Layer 0: Laser Flow (Opaque Background) - Extended downwards */}
      <div className="absolute inset-x-0 top-0 -bottom-32 z-0 pointer-events-none">
        {' '}
        {/* bottom-32 (~128px) заходит на след. секцию */}
        <LaserFlow
          horizontalBeamOffset={0}
          verticalBeamOffset={-0.3}
          verticalSizing={30.0}
          horizontalSizing={1.0}
          wispDensity={3.0}
          fogIntensity={4.0}
          flowSpeed={0.2 + vaultOffset * 0.3}
          wispSpeed={10 + vaultOffset * 20}
          wispIntensity={4 + vaultOffset * 5}
          color="#FF79C6"
          className="h-full w-full"
        />
      </div>

      {/* Layer 1: Grid with Reveal Mask (Interactive Middle Layer) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          maskImage:
            'radial-gradient(circle 300px at var(--mx) var(--my), black 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle 300px at var(--mx) var(--my), black 0%, transparent 100%)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <CameraRig />
          <Grid
            args={[60, 60]}
            cellColor="#888888"
            sectionColor="#AAAAAA"
            cellThickness={0.5}
            sectionThickness={1}
            position={[0, 0, -25]}
            rotation={[Math.PI / 2, 0, 0]}
            infiniteGrid={true}
            fadeDistance={50}
            fadeStrength={1.5}
          />
        </Canvas>
      </div>

      {/* Layer 2: Foreground Vault (Always Visible) */}
      <Canvas
        className="absolute inset-0 z-20 pointer-events-none"
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<SceneLoader />}>
          <Lights />
          <CameraRig />
          <Vault />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
