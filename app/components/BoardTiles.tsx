import { useLayoutEffect, useRef } from "react";
import type { Square } from "chess.js";
import * as THREE from "three";
import { CHESS_MATERIAL } from "../globals/globals";

export function BoardTiles({ colors, onSelect, onMaterial }: {
  colors: string[];
  onSelect: (square: Square) => void;
  onMaterial: (material: THREE.MeshPhysicalMaterial | null) => void;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let index = 0; index < 64; index++) {
      mesh.current.setMatrixAt(index, matrix.makeTranslation(index % 8 - 3.5, 0.05, Math.floor(index / 8) - 3.5));
      mesh.current.setColorAt(index, color.set(colors[index]));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [colors]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 64]} receiveShadow
      onClick={(event) => {
        if (event.instanceId === undefined) return;
        event.stopPropagation();
        const index = event.instanceId;
        onSelect(`${String.fromCharCode(97 + index % 8)}${8 - Math.floor(index / 8)}` as Square);
      }}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshPhysicalMaterial ref={onMaterial} {...CHESS_MATERIAL} />
    </instancedMesh>
  );
}
