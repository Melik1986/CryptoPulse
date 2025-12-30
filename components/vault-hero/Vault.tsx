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
import { useVaultOffset } from '@/lib/stores/vault-store';
import * as THREE from 'three';

// Загрузка GLB модели
useGLTF.preload('/model/Vault.glb');

export function Vault() {
  // Загружаем GLB модель
  const { scene } = useGLTF('/model/Vault.glb');
  const vaultRef = useRef<THREE.Group>(null);

  // ✅ Этап 2: Подключен useVaultStore
  const vaultOffset = useVaultOffset();

  // Клонируем сцену один раз при монтировании
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Находим части модели по именам
  const { leftPart, rightPart } = useMemo(() => {
    // Debug: log all child names
    console.log(
      'Vault Model Children:',
      clonedScene.children.map((c) => c.name),
    );

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

      const leftDir =
        initialPositions.current.left !== 0 ? Math.sign(initialPositions.current.left) : -1;

      const rightDir =
        initialPositions.current.right !== 0 ? Math.sign(initialPositions.current.right) : 1;

      // Коэффициент 2.5 определяет ширину открытия
      const targetLeftX = initialPositions.current.left + leftDir * vaultOffset * 2.5;
      const targetRightX = initialPositions.current.right + rightDir * vaultOffset * 2.5;

      // Плавная интерполяция
      // Note: Direct mutation of three.js objects in useFrame is the recommended way for performance.
      // We are suppressing the exhaustive-deps warning because we intentionally want this to run every frame
      // without re-triggering based on dependencies that might cause re-renders.
      // eslint-disable-next-line react-hooks/immutability
      leftPart.position.x = THREE.MathUtils.lerp(leftPart.position.x, targetLeftX, 0.1);
      // eslint-disable-next-line react-hooks/immutability
      rightPart.position.x = THREE.MathUtils.lerp(rightPart.position.x, targetRightX, 0.1);
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
