/**
 * Vault Store - Zustand хранилище для Vault Hero
 * @module lib/stores/vault-store
 *
 * Управляет состоянием 3D сцены Vault:
 * - Позиция мыши для parallax эффекта
 * - Прогресс скролла для анимации раздвижения створок
 * - Вычисляемый vaultOffset на основе scrollProgress
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Полный интерфейс Vault Store (State + Actions)
 */
interface VaultStore extends VaultState, VaultActions {}

/**
 * Создание Zustand store с devtools middleware
 * @see https://github.com/pmndrs/zustand
 */
export const useVaultStore = create<VaultStore>()(
  devtools(
    // eslint-disable-next-line max-lines-per-function
    (set) => ({
      // ============================================
      // Initial State
      // ============================================
      vaultOffset: 0,
      mouse: { x: 0, y: 0 },
      scrollProgress: 0,
      isAnimating: false,
      flashlight: {
        enabled: true,
        radius: 300,
        opacity: 0.9,
        sharpness: 0.5,
      },

      // ============================================
      // Actions
      // ============================================

      /**
       * Устанавливает offset для раздвижения створок Vault
       * @param offset - значение от 0 (закрыт) до 1 (полностью открыт)
       */
      setVaultOffset: (offset: number) => {
        set({ vaultOffset: Math.max(0, Math.min(1, offset)) }, false, 'setVaultOffset');
      },

      /**
       * Устанавливает позицию мыши для parallax эффекта камеры
       * @param x - нормализованная X координата (-1 до 1)
       * @param y - нормализованная Y координата (-1 до 1)
       */
      setMouse: (x: number, y: number) => {
        set(
          {
            mouse: {
              x: Math.max(-1, Math.min(1, x)),
              y: Math.max(-1, Math.min(1, y)),
            },
          },
          false,
          'setMouse',
        );
      },

      /**
       * Устанавливает прогресс скролла и автоматически вычисляет vaultOffset
       * @param progress - прогресс скролла от 0 до 1
       */
      setScrollProgress: (progress: number) => {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const vaultOffset = clampedProgress; // Прямая зависимость: scrollProgress = vaultOffset

        set(
          {
            scrollProgress: clampedProgress,
            vaultOffset,
            isAnimating: clampedProgress > 0 && clampedProgress < 1,
          },
          false,
          'setScrollProgress',
        );
      },

      /**
       * Устанавливает флаг активности анимации
       * @param isAnimating - true если анимация активна
       */
      setIsAnimating: (isAnimating: boolean) => {
        set({ isAnimating }, false, 'setIsAnimating');
      },

      /**
       * Обновляет конфигурацию эффекта фонарика
       */
      setFlashlight: (config) => {
        set(
          (state) => ({
            flashlight: { ...state.flashlight, ...config },
          }),
          false,
          'setFlashlight',
        );
      },

      /**
       * Сбрасывает состояние в начальное значение
       */
      reset: () => {
        set(
          {
            vaultOffset: 0,
            mouse: { x: 0, y: 0 },
            scrollProgress: 0,
            isAnimating: false,
            flashlight: {
              enabled: true,
              radius: 300,
              opacity: 0.9,
              sharpness: 0.5,
            },
          },
          false,
          'reset',
        );
      },
    }),
    { name: 'VaultStore' },
  ),
);

/**
 * Хук для получения текущего смещения створок
 */
export const useVaultOffset = () => useVaultStore((state) => state.vaultOffset);

/**
 * Селектор для mouse позиции
 * @example
 * const mouse = useVaultMouse();
 */
export const useVaultMouse = () => useVaultStore((state) => state.mouse);

/**
 * Селектор для scrollProgress
 * @example
 * const scrollProgress = useVaultScrollProgress();
 */
export const useVaultScrollProgress = () => useVaultStore((state) => state.scrollProgress);

/**
 * Селектор для isAnimating
 * @example
 * const isAnimating = useVaultIsAnimating();
 */
export const useVaultIsAnimating = () => useVaultStore((state) => state.isAnimating);
