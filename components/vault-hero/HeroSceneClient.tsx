'use client';

/**
 * HeroScene.client - Клиентский wrapper для динамического импорта
 * @module components/vault-hero/HeroScene.client
 *
 * Используется для избежания SSR проблем с Three.js
 */

import dynamic from 'next/dynamic';

const HeroSceneDynamic = dynamic(() => import('./HeroScene').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[calc(100svh-5rem)] w-full bg-[#0a0e1a]" />,
});

export { HeroSceneDynamic as HeroScene };
