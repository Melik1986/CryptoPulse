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
      // Полная высота прокрутки, при которой анимация завершается (например, 100vh)
      // Можно настроить чувствительность, умножив innerHeight
      const scrollHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      // Вычисляем прогресс от 0 до 1
      // При скролле равном высоте экрана, прогресс будет 1 (полное открытие)
      const progress = Math.min(Math.max(currentScroll / scrollHeight, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Вызываем сразу для инициализации
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollProgress]);
}
