"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Створюємо компонент-обгортку для плавного руху
export function AnimatedGroup({
  position,
  rotation,
  children,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Кешуємо цільові вектори, щоб не навантажувати пам'ять
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetRot = useMemo(() => new THREE.Euler(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Встановлюємо координати, які прийшли з Redux
    targetPos.set(...position);
    targetRot.set(...rotation);

    // Плавне наближення поточної позиції до цільової (швидкість 3)
    groupRef.current.position.lerp(targetPos, delta * 3);

    // Плавне наближення обертання
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRot.x,
      delta * 3,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRot.y,
      delta * 3,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRot.z,
      delta * 3,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}
