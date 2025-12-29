'use client';

/**
 * HeroScene - Главный контейнер для 3D Canvas
 * @module components/vault-hero/HeroScene
 *
 * TODO Этап 2: Подключить useVaultEvents
 * TODO Этап 4: Добавить LaserFlow
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Vault } from './Vault';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';

/** Loading fallback для 3D сцены */
function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#1b1f2a" wireframe />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="h-screen w-full relative" id="vault-hero">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<SceneLoader />}>
          <Lights />
          <CameraRig />
          <Vault />
          {/* TODO Этап 4: <LaserFlow /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
