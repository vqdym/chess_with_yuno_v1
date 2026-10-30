import { useEffect, useEffectEvent } from "react";
import type { Square } from "chess.js";
import { EngineMove } from "../types/EngineMove";

type Options = {
  fen: string;
  gameId: number;
  enabled: boolean;
  skillLevel?: number;
  moveTimeMs?: number;
  moveDelayMs?: number;
  onMoveReady?: () => void;
  onBestMove: (move: EngineMove) => void;
};

export function useStockfish({
  fen,
  gameId,
  enabled,
  skillLevel = 5,
  moveTimeMs = 700,
  moveDelayMs = 0,
  onMoveReady,
  onBestMove,
}: Options) {
  const prepareMove = useEffectEvent(
    (searchedFen: string, searchedGameId: number) => {
      if (!enabled || fen !== searchedFen || gameId !== searchedGameId) return false;
      onMoveReady?.();
      return true;
    },
  );
  const deliverMove = useEffectEvent(
    (move: EngineMove, searchedFen: string, searchedGameId: number) => {
      if (!enabled) return;
      if (fen !== searchedFen || gameId !== searchedGameId) return;

      onBestMove(move);
    },
  );

  useEffect(() => {
    if (!enabled) return;

    const engine = new Worker(
      "/stockfish/stockfish-19-lite-single.js",
    );

    let disposed = false;
    let searching = false;
    let moveTimer: ReturnType<typeof setTimeout> | undefined;

    engine.onmessage = (event: MessageEvent<string>) => {
      if (disposed || typeof event.data !== "string") return;

      for (const rawLine of event.data.split("\n")) {
        const line = rawLine.trim();

        if (line === "uciok") {
          engine.postMessage(
            "setoption name UCI_LimitStrength value false",
          );
          engine.postMessage(
            `setoption name Skill Level value ${skillLevel}`,
          );
          engine.postMessage("setoption name Hash value 32");
          engine.postMessage("ucinewgame");
          engine.postMessage("isready");
        }

        if (line === "readyok" && !searching) {
          searching = true;
          engine.postMessage(`position fen ${fen}`);
          engine.postMessage(`go movetime ${moveTimeMs}`);
        }

        if (line.startsWith("bestmove ")) {
          disposed = true;
          engine.terminate();

          const match = line.match(
            /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?(?:\s|$)/,
          );

          if (!match) return;

          const move = {
            from: match[1] as Square,
            to: match[2] as Square,
            promotion: match[3] as EngineMove["promotion"],
          };
          if (!prepareMove(fen, gameId)) return;
          // Start the character gesture before moving the chess piece.
          moveTimer = setTimeout(() => deliverMove(move, fen, gameId), moveDelayMs);
          return;
        }
      }
    };

    engine.onerror = (event) => {
      console.error("Stockfish error:", event);
      disposed = true;
      engine.terminate();
    };

    engine.postMessage("uci");

    return () => {
      disposed = true;
      clearTimeout(moveTimer);
      engine.terminate();
    };
  }, [enabled, fen, gameId, skillLevel, moveTimeMs, moveDelayMs]);
}
