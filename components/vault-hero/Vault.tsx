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

  useFrame(() => {
    if (vaultRef.current) {
      // Ищем части модели для анимации раздвижения
      // Предполагаем что в модели есть части с именами "Left" и "Right" или используем первый и второй children
      const children = vaultRef.current.children;
      if (children.length >= 2) {
        const leftPart = children[0];
        const rightPart = children[1];

        if (leftPart && rightPart) {
          leftPart.position.x = THREE.MathUtils.lerp(leftPart.position.x, -0.5 - vaultOffset, 0.1);
          rightPart.position.x = THREE.MathUtils.lerp(rightPart.position.x, 0.5 + vaultOffset, 0.1);
        }
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
