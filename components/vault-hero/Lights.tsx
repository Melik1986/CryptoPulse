'use client';

/**
 * Lights - Освещение 3D сцены
 * Cinematic lighting с ambient, point и spot lights
 */

export function Lights() {
  return (
    <>
      {/* Базовое окружающее освещение */}
      <ambientLight intensity={0.2} />

      {/* Основной источник света (голубой) */}
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#00ffff" castShadow />

      {/* Дополнительные spot lights для объёма */}
      <spotLight position={[5, 5, 10]} intensity={0.5} angle={0.3} penumbra={0.5} castShadow />
      <spotLight position={[-5, 5, 10]} intensity={0.5} angle={0.3} penumbra={0.5} castShadow />

      {/* Rim light сзади для контура */}
      <pointLight position={[0, 0, -5]} intensity={0.3} color="#ff00ff" />
    </>
  );
}
