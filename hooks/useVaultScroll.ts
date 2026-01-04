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
      const track = document.getElementById('vault-hero-track');
      if (!track) {
        // Fallback if track not found (e.g. during initial render or if layout changed)
        return;
      }

      const rect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const trackHeight = track.offsetHeight;

      // Distance available for scrolling while the inner content is sticky
      // (Total Height - Viewport Height)
      const scrollableDistance = trackHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      // rect.top goes from 0 down to -scrollableDistance as we scroll down.
      // We invert it to get positive progress.
      const currentScroll = -rect.top;

      const progress = Math.min(Math.max(currentScroll / scrollableDistance, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also listen to resize to update calculations
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [setScrollProgress]);
}
