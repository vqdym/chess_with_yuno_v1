import { Square } from "chess.js";

export type CapturedVisual = {
  type: string;
  color: "w" | "b";
  square: Square;
};