'use client';

/**
 * CameraRig - Управление камерой с параллакс-эффектом
 * @module components/vault-hero/CameraRig
 *
 * TODO Этап 2: Подключить useVaultStore для mouse
 */

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();

  // TODO Этап 2: Заменить на useVaultStore
  const mouse = { x: 0, y: 0 };

  /* eslint-disable react-hooks/immutability -- R3F стандартный паттерн: мутация camera в useFrame */
  useFrame(() => {
    const targetX = mouse.x * 0.5;
    const targetY = mouse.y * 0.3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}
