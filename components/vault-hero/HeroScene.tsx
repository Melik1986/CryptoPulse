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

  return (
    <div className="h-screen w-full relative" id="vault-hero">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0e1a' }}
      >
        <Suspense fallback={<SceneLoader />}>
          <Lights />
          <CameraRig />
          {/* Сетка на фоне (вертикально за моделью) */}
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
          <Vault />
          {/* TODO Этап 6: <LaserFlow /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
