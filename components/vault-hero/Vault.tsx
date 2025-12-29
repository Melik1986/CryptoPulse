'use client';

/**
 * Vault - 3D модель хранилища с двумя створками
 * @module components/vault-hero/Vault
 *
 * ✅ Этап 2: Подключен useVaultStore для vaultOffset
 * TODO Этап 3: Загрузить GLB модель вместо boxGeometry
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVaultOffset } from '@/lib/stores/vault-store';
import * as THREE from 'three';

export function Vault() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  // ✅ Этап 2: Подключен useVaultStore
  const vaultOffset = useVaultOffset();

  useFrame(() => {
    if (leftRef.current && rightRef.current) {
      leftRef.current.position.x = THREE.MathUtils.lerp(
        leftRef.current.position.x,
        -0.5 - vaultOffset,
        0.1,
      );
      rightRef.current.position.x = THREE.MathUtils.lerp(
        rightRef.current.position.x,
        0.5 + vaultOffset,
        0.1,
      );
    }
  });

  return (
    <group>
      {/* Левая створка */}
      <mesh ref={leftRef} position={[-0.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 0.5]} />
        <meshStandardMaterial color="#1b1f2a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Правая створка */}
      <mesh ref={rightRef} position={[0.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 4, 0.5]} />
        <meshStandardMaterial color="#1b1f2a" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
