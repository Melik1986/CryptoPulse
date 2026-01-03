'use client';

import { useThree } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * FittedGrid - Сетка, которая автоматически подстраивается под размеры вьюпорта,
 * исключая зону перекрытия (overlap), чтобы не залезать на следующую секцию.
 */
export function FittedGrid() {
  const { camera, size, viewport: defaultViewport } = useThree();

  const { width, height, yPosition } = useMemo(() => {
    // Получаем корректный viewport для глубины Z = -25, где находится сетка
    const targetZ = -25;
    const viewport = defaultViewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, targetZ));

    const overlapPx = 64; // Должно совпадать с --FOG_OVERLAP в HeroScene

    // Конвертируем пиксели overlap в мировые единицы на глубине сетки
    // viewport.height - это высота видимой области на глубине -25
    const overlapWorld = viewport.height * (overlapPx / Math.max(1, size.height));

    // Мы хотим, чтобы сетка заканчивалась ровно там, где заканчивается секция Hero.
    // Канвас выше секции Hero на величину overlapPx.
    // Значит, видимая высота сетки должна быть меньше высоты канваса на overlapWorld.
    const gridVisibleHeight = Math.max(0.1, viewport.height - overlapWorld);

    // Ширина сетки с запасом
    const gridWidth = Math.max(viewport.width * 3, 100);

    // Позиционирование:
    // Канвас центрирован в [0,0]. Его границы по Y (в проекции на Z=-25): +H/2 и -H/2.
    // Секция Hero занимает верхнюю часть канваса.
    // Нижний край Hero находится выше нижнего края Canvas на overlapWorld.
    // Нижняя граница Canvas: -viewport.height / 2
    // Нижняя граница Hero: -viewport.height / 2 + overlapWorld
    // Центр сетки (высотой gridVisibleHeight): Нижняя граница Hero + gridVisibleHeight / 2
    // y = (-viewport.height / 2 + overlapWorld) + (viewport.height - overlapWorld) / 2
    // y = -viewport.height / 2 + overlapWorld + viewport.height / 2 - overlapWorld / 2
    // y = overlapWorld / 2
    const yPosition = overlapWorld / 2;

    return {
      width: gridWidth,
      height: gridVisibleHeight,
      yPosition,
    };
  }, [camera, size, defaultViewport]);

  return (
    <Grid
      args={[width, height]}
      position={[0, yPosition, -25]}
      rotation={[Math.PI / 2, 0, 0]}
      infiniteGrid={false}
      fadeDistance={50}
      fadeStrength={1.5}
      cellColor="#888888"
      sectionColor="#AAAAAA"
      cellThickness={0.5}
      sectionThickness={1}
    />
  );
}
