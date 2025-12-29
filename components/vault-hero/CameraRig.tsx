'use client';

/**
 * CameraRig - Управление камерой с параллакс-эффектом
 * @module components/vault-hero/CameraRig
 *
 * ✅ Этап 2: Подключен useVaultStore для mouse
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useVaultMouse } from '@/lib/stores/vault-store';
import * as THREE from 'three';

export function CameraRig() {
  const { camera } = useThree();

  // ✅ Этап 2: Подключен useVaultStore
  const mouse = useVaultMouse();

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
