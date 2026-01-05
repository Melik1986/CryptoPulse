'use client';

/**
 * Vault - 3D модель хранилища с двумя створками
 * @module components/vault-hero/Vault
 *
 * ✅ Этап 2: Подключен useVaultStore для vaultOffset
 * ✅ Этап 4: Загружена GLB модель Vault.glb
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useVaultScrollProgress } from '@/lib/stores/vault-store';
import * as THREE from 'three';

// Загрузка GLB модели
useGLTF.preload('/model/Vault.glb');

// eslint-disable-next-line max-lines-per-function
export function Vault() {
  // Загружаем GLB модель
  const { scene } = useGLTF('/model/Vault.glb');
  const vaultRef = useRef<THREE.Group>(null);

  // Получаем прогресс скролла (0..1)
  const scrollProgress = useVaultScrollProgress();

  // Клонируем сцену один раз при монтировании и применяем материал
  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    // Новый материал: Графит/Обсидиан
    const vaultMaterial = new THREE.MeshPhysicalMaterial({
      // Цвет: Глубокий индиго-черный
      color: new THREE.Color('#050508'), // База почти черная
      emissive: new THREE.Color('#0a0a15'), // Едва заметное собственное свечение индиго
      emissiveIntensity: 0.1,

      // Фактура "Метаматериала"
      metalness: 0.9, // Почти полный металл
      roughness: 0.7, // Высокая шероховатость (графит/матовость)

      // Детализация поверхности (Micro-surface)
      clearcoat: 0.3, // Тонкий слой лака (как на обсидиане)
      clearcoatRoughness: 0.4, // Лак тоже слегка матовый

      // Отражения
      reflectivity: 0.2, // Низкая отражающая способность (поглощение света)

      // Геометрия
      flatShading: false, // Гладкое затенение
      side: THREE.DoubleSide, // Рендерить обе стороны граней (фикс прозрачности)
    });

    // Применяем материал ко всем мешам
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = vaultMaterial;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Находим части модели по именам
  const { leftPart, rightPart } = useMemo(() => {
    // Try to find by name, fallback to children index if names don't match
    let left = clonedScene.getObjectByName('Vault_Left');
    let right = clonedScene.getObjectByName('Vault_Right');

    // Fallback logic if names are missing
    if (!left || !right) {
      if (clonedScene.children.length >= 2) {
        left = clonedScene.children[0];
        right = clonedScene.children[1];
      }
    }

    return { leftPart: left, rightPart: right };
  }, [clonedScene]);

  // Храним начальные позиции для корректной анимации
  const initialPositions = useRef<{ left: number; right: number } | null>(null);

  useFrame(() => {
    if (leftPart && rightPart) {
      // Инициализируем начальные позиции при первом кадре
      if (!initialPositions.current) {
        initialPositions.current = {
          left: leftPart.position.x,
          right: rightPart.position.x,
        };
      }

      // Вычисляем целевые позиции
      // Автоматически определяем направление на основе начальной позиции:
      // Если часть слева (x < 0) -> двигаем влево (- offset)
      // Если часть справа (x > 0) -> двигаем вправо (+ offset)
      // Если x = 0, используем fallback: leftPart -> влево, rightPart -> вправо

      // --- Timeline Logic (Updated: Start Open -> Close -> Exit) ---
      let currentOffset = 0;
      let parallaxY = 0;

      if (scrollProgress < 0.3) {
        // 0.0 -> 0.3 : Closing (1 -> 0)
        // scroll 0 => offset 1 (Open)
        // scroll 0.3 => offset 0 (Closed)
        currentOffset = 1 - scrollProgress / 0.3;
        parallaxY = 0;
      } else {
        // 0.3 -> 1.0 : Closed (0) + Parallax Exit
        currentOffset = 0;
        // Parallax: 0.3 -> 1.0 mapped to 0 -> 5 units up (Reduced speed)
        // (scrollProgress - 0.3) goes from 0 to 0.7
        // We divide by 0.7 to normalize to 0..1
        parallaxY = ((scrollProgress - 0.3) / 0.7) * 7;
      }

      // Clamp values just in case
      currentOffset = Math.max(0, Math.min(1, currentOffset));

      const leftDir =
        initialPositions.current.left !== 0 ? Math.sign(initialPositions.current.left) : -1;

      const rightDir =
        initialPositions.current.right !== 0 ? Math.sign(initialPositions.current.right) : 1;

      // Коэффициент 2.5 определяет ширину открытия
      const targetLeftX = initialPositions.current.left + leftDir * currentOffset * 2.5;
      const targetRightX = initialPositions.current.right + rightDir * currentOffset * 2.5;

      // Плавная интерполяция X (двери)
      // eslint-disable-next-line react-hooks/immutability
      leftPart.position.x = THREE.MathUtils.lerp(leftPart.position.x, targetLeftX, 0.1);
      // eslint-disable-next-line react-hooks/immutability
      rightPart.position.x = THREE.MathUtils.lerp(rightPart.position.x, targetRightX, 0.1);

      // Плавная интерполяция Y (параллакс уход вверх)
      if (vaultRef.current) {
        const targetY = -2.5 + parallaxY; // -2.5 is initial Y
        vaultRef.current.position.y = THREE.MathUtils.lerp(
          vaultRef.current.position.y,
          targetY,
          0.1,
        );
      }
    }
  });

  return (
    <group ref={vaultRef} position={[0, -2.5, 0]}>
      <primitive
        object={clonedScene}
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
}
