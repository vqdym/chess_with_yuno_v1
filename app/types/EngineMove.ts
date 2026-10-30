import { Square } from "chess.js";

export type EngineMove = {
  from: Square;
  to: Square;
  promotion?: "q" | "r" | "b" | "n";
};