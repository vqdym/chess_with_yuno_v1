import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { Square } from "chess.js";
import squareToPosition from "../helpers/squareToPostition";
import { CapturedVisual } from "../types/CapturedVisual";

export function CapturedPiece({
  type,
  color,
  square,
}: CapturedVisual) {
  const colorName = color === "w" ? "White" : "Black";
  const gltf = useGLTF(`/models/chess/${type}${colorName}.glb`);

  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      object.raycast = () => {};
    });

    return clone;
  }, [gltf.scene]);

  return (
    <primitive
      object={model}
      position={squareToPosition(square)}
      scale={3.5}
    />
  );
}