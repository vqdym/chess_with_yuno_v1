import { Square } from "chess.js";

export default function squareToPosition(square: Square): [number, number, number] {
  const col = square.charCodeAt(0) - "a".charCodeAt(0);
  const row = 8 - Number(square[1]);

  return [col - 3.5, 0.55, row - 3.5];
}