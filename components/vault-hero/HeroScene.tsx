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
import { Vault } from './Vault';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';
import { useVaultEvents } from '@/hooks/useVaultEvents';

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
          <Vault />
          {/* TODO Этап 6: <LaserFlow /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
