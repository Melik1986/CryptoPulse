'use client';

/**
 * useVaultScroll - Хук для scroll-анимации Vault
 * @module hooks/useVaultScroll
 *
 * ✅ Этап 5: Реализация скролл-анимации
 */

import { useEffect } from 'react';
import { useVaultStore } from '@/lib/stores/vault-store';

export function useVaultScroll() {
  const setScrollProgress = useVaultStore((state) => state.setScrollProgress);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      const progress = Math.min(Math.max(currentScroll / scrollHeight, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollProgress]);
}
