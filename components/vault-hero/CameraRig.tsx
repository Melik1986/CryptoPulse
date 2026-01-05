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
  const { camera, viewport } = useThree();

  // ✅ Этап 2: Подключен useVaultStore
  const mouse = useVaultMouse();

  /* eslint-disable react-hooks/immutability -- R3F стандартный паттерн: мутация camera в useFrame */
  useFrame(() => {
    // Адаптивная позиция Z камеры
    // Mobile (< 768px): z = 14 (отдаляем камеру)
    // Desktop: z = 8 (стандартная позиция)

    // Если портретная ориентация (aspect < 1), увеличиваем Z, чтобы вместить объект
    const aspect = viewport.aspect;
    const baseZ = 8;
    const targetZ = aspect < 1 ? baseZ + (1 / aspect) * 4 : baseZ;

    const targetX = mouse.x * 1.5;
    const targetY = mouse.y * 1.0;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}
