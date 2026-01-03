'use client';

/**
 * HeroScene - Главный контейнер для 3D Canvas
 * @module components/vault-hero/HeroScene
 *
 * ✅ Этап 4: Подключен useVaultEvents для mousemove
 * ✅ Этап 6: Добавить LaserFlow
 */

import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Vault } from './Vault';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';
import { useVaultEvents } from '@/hooks/useVaultEvents';
import { useVaultScroll } from '@/hooks/useVaultScroll';
import { LaserFlow } from '@/components/vault-hero/LaserFlow';
import { FittedGrid } from '@/components/vault-hero/FittedGrid';
import { useVaultStore } from '@/lib/stores/vault-store';

/** Простая проверка на производительность устройства */
const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return true;

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

  // Эвристика: интегрированные видеокарты или мобильные GPU
  return /Intel|SwiftShader|Mali|Adreno/i.test(renderer);
};

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
  const [isLowEnd] = useState(() => {
    // Lazy initial state: выполняется только один раз при маунте
    if (typeof window !== 'undefined') {
      return isLowEndDevice();
    }
    return false;
  });

  const FOG_OVERLAP = 64;

  return (
    <div
      className="h-[calc(100svh-6rem)] w-full relative bg-[#0a0e1a]"
      id="vault-hero"
      style={
        {
          '--mx': `${(mouse.x + 1) * 50}%`,
          '--my': `${(1 - mouse.y) * 50}%`,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute left-0 top-0 right-0 pointer-events-none"
        style={{ height: `calc(100% + ${FOG_OVERLAP}px)` }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={isLowEnd ? [1, 1] : [1, 2]}
          gl={{ antialias: !isLowEnd, alpha: true }}
        >
          <Suspense fallback={<SceneLoader />}>
            <CameraRig />
            <FittedGrid />
            <LaserFlow
              horizontalBeamOffset={0}
              verticalBeamOffset={-0.3}
              verticalSizing={30.0}
              horizontalSizing={1.0}
              wispDensity={isLowEnd ? 1.5 : 3.0}
              fogIntensity={3.0}
              decay={1.0}
              flowSpeed={0.2}
              wispSpeed={10}
              wispIntensity={4}
              color="#FF79C6"
            />
            <Lights />
            <Vault />
            {!isLowEnd && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  height={300}
                  intensity={0.5}
                />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default HeroScene;
