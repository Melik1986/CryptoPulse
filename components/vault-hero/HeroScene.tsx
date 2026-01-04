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
import Image from 'next/image';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Vault } from './Vault';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';
import { useVaultEvents } from '@/hooks/useVaultEvents';
import { useVaultScroll } from '@/hooks/useVaultScroll';
import { LaserFlow } from '@/components/vault-hero/LaserFlow';
// import { FittedGrid } from '@/components/vault-hero/FittedGrid';
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

  const mouse = useVaultStore((state) => state.mouse);
  const flashlight = useVaultStore(
    (state) => state.flashlight || { enabled: false, radius: 300, opacity: 0.9, sharpness: 0.5 },
  );

  const [isLowEnd] = useState(() => {
    // Lazy initial state: выполняется только один раз при маунте
    if (typeof window !== 'undefined') {
      return isLowEndDevice();
    }
    return false;
  });

  const FOG_OVERLAP = 40;

  return (
    <div
      className="relative w-full overflow-visible"
      style={{ height: '300vh' }}
      id="vault-hero-track"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-visible"
        id="vault-hero"
        style={
          {
            '--mx': `${(mouse.x + 1) * 50}%`,
            '--my': `${(1 - mouse.y) * 50}%`,
          } as React.CSSProperties
        }
      >
        {/* Background color matching the page body */}
        <div
          className="absolute inset-0 z-[-1]"
          style={{
            background: '#0f1316',
          }}
        />

        {/* Background Container with Flashlight Reveal Mask */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{
            maskImage: flashlight.enabled
              ? `radial-gradient(circle ${flashlight.radius * 1.5}px at var(--mx) var(--my), black 0%, transparent 100%)`
              : undefined,
            WebkitMaskImage: flashlight.enabled
              ? `radial-gradient(circle ${flashlight.radius * 1.5}px at var(--mx) var(--my), black 0%, transparent 100%)`
              : undefined,
          }}
        >
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
              linear-gradient(to right, #444 1px, transparent 1px),
              linear-gradient(to bottom, #444 1px, transparent 1px)
            `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Logo Layer - Column Layout: Icon Top, Text Bottom */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 select-none">
            {/* Icon - Left part of SVG */}
            <div className="w-[23rem] h-[23rem] relative overflow-hidden shrink-0">
              <Image
                src="/logo.svg"
                alt="CoinPulse Icon"
                fill
                className="object-cover object-left"
                priority
                style={{ filter: 'sepia(100%) hue-rotate(100deg) saturate(500%)' }}
              />
            </div>

            {/* Text - Right part of SVG */}
            <div
              className="h-[23.75rem] mb-[2.5rem] relative overflow-hidden shrink-0"
              style={{ aspectRatio: '86/30' }}
            >
              <Image
                src="/logo.svg"
                alt="CoinPulse Text"
                fill
                className="object-cover object-right"
                priority
              />
            </div>
          </div>
        </div>

        <div
          className="absolute left-0 top-0 right-0 pointer-events-none z-10"
          style={{
            height: `calc(100% + ${FOG_OVERLAP}px)`,
            // Outer Mask: Bottom Fade (hides the seam)
            maskImage: `linear-gradient(to bottom, black calc(100% - ${FOG_OVERLAP}px), transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black calc(100% - ${FOG_OVERLAP}px), transparent 100%)`,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={isLowEnd ? [1, 1] : [1, 2]}
            gl={{ antialias: !isLowEnd, alpha: true }}
          >
            <Suspense fallback={<SceneLoader />}>
              <CameraRig />
              {/* <FittedGrid /> - Replaced by CSS Grid behind Canvas */}
              <LaserFlow
                horizontalBeamOffset={0}
                verticalBeamOffset={-0.3}
                verticalSizing={30.0}
                horizontalSizing={1.0}
                wispDensity={isLowEnd ? 1.5 : 3.0}
                fogIntensity={1.5}
                fogScale={0.5}
                decay={1.0}
                flowSpeed={0.2}
                wispSpeed={15}
                wispIntensity={2.5}
                mouseTiltStrength={0.12}
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
    </div>
  );
}

export default HeroScene;
