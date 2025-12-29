'use client';

/**
 * useVaultEvents - Хук для обработки событий мыши для Vault Hero
 * @module hooks/useVaultEvents
 *
 * ✅ Этап 4: Обработка mousemove для parallax эффекта камеры
 */

import { useEffect, useRef } from 'react';
import { useVaultStore } from '@/lib/stores/vault-store';

/**
 * Хук для обработки событий мыши и обновления позиции в Zustand store
 * Нормализует координаты мыши от -1 до 1 для использования в 3D сцене
 */
export function useVaultEvents() {
  const containerRef = useRef<HTMLElement | null>(null);
  const { setMouse } = useVaultStore();

  useEffect(() => {
    const container = document.getElementById('vault-hero');
    if (!container) return;

    containerRef.current = container;

    /**
     * Обработчик движения мыши
     * Нормализует координаты: центр = (0, 0), края = (-1, -1) до (1, 1)
     */
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Нормализация координат от -1 до 1
      const normalizedX = ((event.clientX - centerX) / rect.width) * 2;
      const normalizedY = ((event.clientY - centerY) / rect.height) * 2;

      setMouse(normalizedX, normalizedY);
    };

    /**
     * Обработчик выхода мыши за пределы контейнера
     * Сбрасывает позицию в центр
     */
    const handleMouseLeave = () => {
      setMouse(0, 0);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [setMouse]);

  return containerRef;
}
