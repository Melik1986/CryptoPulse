'use client';

/**
 * HeroScene.client - Клиентский wrapper для динамического импорта
 * @module components/vault-hero/HeroScene.client
 *
 * Используется для избежания SSR проблем с Three.js
 */

import dynamic from 'next/dynamic';

const HeroSceneDynamic = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0e1a]">
      <div className="text-cyan-400 text-lg">Loading Vault...</div>
    </div>
  ),
});

export { HeroSceneDynamic as HeroScene };
