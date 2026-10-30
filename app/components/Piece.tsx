"use client"
import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Square } from "chess.js";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import squareToPosition from "../helpers/squareToPostition";

type PieceProps = {
  type: string;
  color: string;
  position: [number, number, number];
  square: Square;
  onDragStart: (square: Square, ray: THREE.Ray) => boolean;
  onDrop: (ray: THREE.Ray) => boolean;
  isDragging: boolean;
  onDragMove: (ray: THREE.Ray) => [number, number, number] | null;
  animateFrom: { from: Square; to: Square; animate: boolean } | null;
  onMoveAnimationEnd: () => void;
};

export function Piece({
  type,
  color,
  position,
  square,
  onDragStart,
  onDrop,
  isDragging,
  onDragMove,
  animateFrom,
  onMoveAnimationEnd
}: PieceProps) {
  const scene = useGLTF(`/models/chess/${type}${color}.glb`);
  const piece = useMemo(() => scene.scene.clone(true), [scene.scene]);
  const pieceRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<[number, number, number]>(
  animateFrom?.animate
    ? squareToPosition(animateFrom.from)
    : [...position],
  );
  const animating = useRef(Boolean(animateFrom?.animate));
  const progress = useRef(0);
  useFrame((_, delta) => {
  const obj = pieceRef.current;
  if (!obj || !animating.current) return;
  if (isDragging) {
    animating.current = false;
    return;
  };
    const duration = 0.45; 
    const height = 0.8;     

    progress.current = Math.min(
      progress.current + delta / duration, 1
    );

    const t = progress.current;
    
    const eased = t * t * (3 - 2 * t);
    const [startX, startY, startZ] = initialPosition.current;
    const [targetX, targetY, targetZ] = position;
    obj.position.x = THREE.MathUtils.lerp(startX, targetX, eased);
    obj.position.z = THREE.MathUtils.lerp(startZ, targetZ, eased);
    if (type == 'n') {
      obj.position.y = THREE.MathUtils.lerp(startY, targetY, eased) + Math.sin(eased * Math.PI) * height;
    }
    if (t == 1) {
      obj.position.set(targetX, targetY, targetZ);
      animating.current = false;
      onMoveAnimationEnd();
    }
  });

  return (
    <primitive
      object={piece}
      ref={pieceRef}
      position={initialPosition.current}
      scale={3.5}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        if (!onDragStart(square, event.ray)) return;

        const captureTarget = event.target as
          | (EventTarget & { setPointerCapture(pointerId: number): void })
          | null;
        captureTarget?.setPointerCapture(event.pointerId);
        if (pieceRef.current) {
          pieceRef.current.position.y = position[1] + 0.15;
        }
      }}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !pieceRef.current) return;

        event.stopPropagation();
        const nextPosition = onDragMove(event.ray);
        if (nextPosition) {
          pieceRef.current.position.set(
            nextPosition[0],
            nextPosition[1] + 0.15,
            nextPosition[2],
          );
        } else {
          pieceRef.current.position.set(...position);
        }
      }}
      onPointerUp={(event: ThreeEvent<PointerEvent>) => {
        if (!isDragging) return;

        event.stopPropagation();
        const moved = onDrop(event.ray);
        if (!moved && pieceRef.current) {
          pieceRef.current.position.set(...position);
        }
      }}
    />
  );
}
