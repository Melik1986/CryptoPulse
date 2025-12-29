'use client';

/**
 * Lights - Освещение 3D сцены
 * Cinematic lighting с ambient, point и spot lights
 * ✅ Увеличена интенсивность для лучшей видимости модели
 */

export function Lights() {
  return (
    <>
      {/* Базовое окружающее освещение - увеличено для видимости */}
      <ambientLight intensity={0.6} />

      {/* Основной источник света (голубой) - увеличена интенсивность */}
      <pointLight position={[0, 0, 5]} intensity={3.0} color="#00ffff" castShadow />

      {/* Дополнительные spot lights для объёма - увеличена интенсивность */}
      <spotLight position={[5, 5, 10]} intensity={1.5} angle={0.4} penumbra={0.5} castShadow />
      <spotLight position={[-5, 5, 10]} intensity={1.5} angle={0.4} penumbra={0.5} castShadow />

      {/* Rim light сзади для контура - увеличена интенсивность */}
      <pointLight position={[0, 0, -5]} intensity={1.0} color="#ff00ff" />

      {/* Дополнительный верхний свет для общего освещения */}
      <directionalLight position={[0, 5, 5]} intensity={1.0} color="#ffffff" />
    </>
  );
}
