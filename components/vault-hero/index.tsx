/**
 * Vault Hero - Экспорт компонентов
 * @module components/vault-hero
 *
 * Этап 1: Базовые экспорты для App Router совместимости
 */

// Динамический импорт для избежания SSR проблем
export { HeroScene } from './HeroScene.client';

// Прямые экспорты (используются внутри HeroScene)
export { Vault } from './Vault';
export { CameraRig } from './CameraRig';
export { Lights } from './Lights';
