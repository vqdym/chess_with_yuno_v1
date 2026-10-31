import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Piece } from "./Piece";
import { BoardTiles } from "./BoardTiles";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Chess, Move, type Square } from "chess.js";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { makeMove, setHoverSquare, setSelectedSquare } from "@/store/gameSlice";
import { CapturedVisual } from "../types/CapturedVisual";
import { CapturedPiece } from "./CapturedPiece";
import { useStockfish } from "../hooks/useStockfish";
import type { EngineMove } from "../types/EngineMove";

const BOARD_THEMES = {
  wood: { light: "#f0d9b5", dark: "#b58863", border: "#4a2f1d" },
  green: { light: "#ffffdd", dark: "#86a666", border: "#2e4a22" },
  blue: { light: "#dee3e6", dark: "#8ca2ad", border: "#283b47" },
  gray: { light: "#e0e0e0", dark: "#757575", border: "#333333" },
};

const SELECTED_THEMES = {
  wood: { light: "#f1db8b", dark: "#c9a85a" },
  green: { light: "#fcf08a", dark: "#a6b95a" },
  blue: { light: "#e6e68f", dark: "#b3b97a" },
  gray: { light: "#e8e393", dark: "#9c9754" },
};

const HOVER_THEMES = {
  wood: "#d9824f",
  green: "#5fbf7a",
  blue: "#5b9bd5",
  gray: "#c7707f",
};

export function ChessBoard({
  onDraggingChange,
  onStockfishMove,
}: {
  onDraggingChange: (isDragging: boolean) => void;
  onStockfishMove: () => void;
}) {
  const dispatch = useAppDispatch();
  const {
    status,
    playerTurn,
    fen,
    result,
    hoverSquare,
    selectedSquare,
    lastMove,
    gameId,
    difficulty
  } = useAppSelector((state) => state.gameState);
  const boardTheme = useAppSelector((state) => state.settings.boardTheme);
  const { clearcoat, roughness, clearcoatRoughness, metalness, reflectivity } =
    useAppSelector((state) => state.chess);
  const [dragFrom, setDragFrom] = useState<Square | null>(null);
  const [moveAnimation, setMoveAnimation] = useState<{
    gameId: number;
    fen: string;
    captured: CapturedVisual | null;
  } | null>(null);
  const isMoveAnimating =
    moveAnimation !== null &&
    moveAnimation.gameId === gameId &&
    moveAnimation.fen === fen;
  const capturedVisual = isMoveAnimating
    ? (moveAnimation?.captured ?? null)
    : null;
  const boardRef = useRef<THREE.Group>(null);
  const angleRef = useRef(playerTurn === 0 ? -Math.PI / 2 : Math.PI / 2);
  const dragOffset = useRef<[number, number]>([0, 0]);
  const materialRefs = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const materialAnimationActive = useRef(true);
  const materialTargets = useMemo(() => ({
    roughness, metalness, clearcoat, clearcoatRoughness, reflectivity,
  }), [roughness, metalness, clearcoat, clearcoatRoughness, reflectivity]);
  useEffect(() => {
    materialAnimationActive.current = true;
  }, [materialTargets]);

  useFrame((_, delta) => {
    if (!boardRef.current) return;

    if (status === "started") {
      const target = playerTurn === 0 ? -Math.PI / 2 : Math.PI / 2;
      angleRef.current = THREE.MathUtils.damp(
        angleRef.current,
        target,
        2,
        delta,
      );
    }

    boardRef.current.rotation.y = angleRef.current;
  });
  useFrame((_, delta) => {
    if (!materialAnimationActive.current) return;
    const targets = materialTargets;
    let settled = true;

    for (const material of materialRefs.current) {
      if (!material) continue;

      material.roughness = THREE.MathUtils.damp(
        material.roughness,
        targets.roughness,
        2,
        delta,
      );
      material.metalness = THREE.MathUtils.damp(
        material.metalness,
        targets.metalness,
        2,
        delta,
      );
      material.clearcoat = THREE.MathUtils.damp(
        material.clearcoat,
        targets.clearcoat,
        2,
        delta,
      );
      material.clearcoatRoughness = THREE.MathUtils.damp(
        material.clearcoatRoughness,
        targets.clearcoatRoughness,
        2,
        delta,
      );
      material.reflectivity = THREE.MathUtils.damp(
        material.reflectivity,
        targets.reflectivity,
        2,
        delta,
      );
      for (const key of Object.keys(targets) as (keyof typeof targets)[]) {
        if (Math.abs(material[key] - targets[key]) < 0.001) {
          material[key] = targets[key];
        } else {
          settled = false;
        }
      }
    }
    materialAnimationActive.current = !settled;
  });
  const game = useMemo(() => new Chess(fen), [fen]);
  const playerColor = playerTurn === 0 ? "w" : "b";
  const canPlayerMove =
    status === "started" &&
    result === "playing" &&
    game.turn() === playerColor &&
    !isMoveAnimating;

  function performMove(input: EngineMove, animate: boolean) {
    if (status !== "started" || result !== "playing" || isMoveAnimating) {
      return false;
    }

    const nextGame = new Chess(fen);
    let move: Move;
    try {
      move = nextGame.move(input);
    } catch {
      return false;
    }

    const capturedSquare = (
      move.flags.includes("e") ? `${move.to[0]}${move.from[1]}` : move.to
    ) as Square;

    const captured = game.get(capturedSquare);

    setMoveAnimation(
      animate
        ? {
            gameId,
            fen: nextGame.fen(),
            captured: captured
              ? {
                  type: captured.type,
                  color: captured.color,
                  square: capturedSquare,
                }
              : null,
          }
        : null,
    );

    dispatch(makeMove({ ...input, animate }));
    dispatch(setSelectedSquare(null));
    dispatch(setHoverSquare(input.to));

    return true;
  }

  useStockfish({
    fen,
    gameId,
    enabled:
      status === "started" &&
      result === "playing" &&
      game.turn() !== playerColor &&
      !isMoveAnimating,
    skillLevel: difficulty,
    moveTimeMs: 1000,
    moveDelayMs: 800,
    onMoveReady: onStockfishMove,
    onBestMove: (move) => {
      performMove(move, true);
    },
  });

  const legalMoves: Move[] = useMemo(() => selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true })
    : [], [game, selectedSquare]);

  function handleSquareClick(square: Square) {
    if (!canPlayerMove) return;

    const piece = game.get(square);

    if (selectedSquare === null) {
      if (piece?.color === playerColor) {
        dispatch(setSelectedSquare(square));
      }
      return;
    }

    if (square === selectedSquare) {
      dispatch(setSelectedSquare(null));
      return;
    }

    const isLegalMove = legalMoves.some((move) => move.to === square);

    if (isLegalMove) {
      performMove(
        {
          from: selectedSquare,
          to: square,
          promotion: "q",
        },
        true,
      );
      return;
    }

    dispatch(setSelectedSquare(piece?.color === playerColor ? square : null));
  }

  function handleDragStart(square: Square, ray: THREE.Ray) {
    if (!canPlayerMove) return false;

    const piece = game.get(square);
    if (piece?.color !== game.turn()) return false;

    const localPoint = getLocalPointOnBoard(ray);
    if (!localPoint) return false;

    const file = square.charCodeAt(0) - 97;
    const row = 8 - Number(square[1]);
    dragOffset.current = [
      localPoint.x - (file - 3.5),
      localPoint.z - (row - 3.5),
    ];
    onDraggingChange(true);
    setDragFrom(square);
    dispatch(setSelectedSquare(square));
    return true;
  }

  function getLocalPointOnBoard(ray: THREE.Ray) {
    const board = boardRef.current;
    if (board === null) return null;

    board.updateWorldMatrix(true, false);
    const pointOnBoard = board.localToWorld(new THREE.Vector3(0, 0.1, 0));
    const normal = new THREE.Vector3(0, 1, 0).transformDirection(
      board.matrixWorld,
    );
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      normal,
      pointOnBoard,
    );
    const worldPoint = ray.intersectPlane(plane, new THREE.Vector3());

    return worldPoint ? board.worldToLocal(worldPoint) : null;
  }

  function handleDragMove(ray: THREE.Ray) {
    if (status !== "started" || result !== "playing" || dragFrom === null)
      return null;
    const localPoint = getLocalPointOnBoard(ray);
    if (
      !localPoint ||
      localPoint.x < -4 ||
      localPoint.x >= 4 ||
      localPoint.z < -4 ||
      localPoint.z >= 4
    ) {
      dispatch(setHoverSquare(null));
      return null;
    }

    const file = Math.floor(localPoint.x + 4);
    const row = Math.floor(localPoint.z + 4);
    dispatch(
      setHoverSquare(`${String.fromCharCode(97 + file)}${8 - row}` as Square),
    );

    return localPoint
      ? ([
          localPoint.x - dragOffset.current[0],
          0.55,
          localPoint.z - dragOffset.current[1],
        ] as [number, number, number])
      : null;
  }

  function handleDrop(ray: THREE.Ray) {
    if (dragFrom === null) return false;

    if (!canPlayerMove) {
      setDragFrom(null);
      dispatch(setSelectedSquare(null));
      onDraggingChange(false);
      return false;
    }

    const localPoint = getLocalPointOnBoard(ray);
    if (
      localPoint &&
      localPoint.x >= -4 &&
      localPoint.x < 4 &&
      localPoint.z >= -4 &&
      localPoint.z < 4
    ) {
      const file = Math.floor(localPoint.x + 4);
      const row = Math.floor(localPoint.z + 4);
      if (file >= 0 && file < 8 && row >= 0 && row < 8) {
        const to = `${String.fromCharCode(97 + file)}${8 - row}` as Square;
        if (selectedSquare === to) dispatch(setHoverSquare(null));
        const legalMoves = game.moves({ square: dragFrom, verbose: true });

        if (legalMoves.some((move) => move.to === to)) {
          const moved = performMove(
            { from: dragFrom, to, promotion: "q" },
            false,
          );
          setDragFrom(null);
          dispatch(setSelectedSquare(null));
          onDraggingChange(false);
          return moved;
        } else {
          dispatch(setHoverSquare(null));
        }
      }
    }

    setDragFrom(null);
    dispatch(setSelectedSquare(null));
    onDraggingChange(false);
    return false;
  }

  const theme =
    BOARD_THEMES[boardTheme as keyof typeof BOARD_THEMES] || BOARD_THEMES.wood;
  const selectedTheme =
    SELECTED_THEMES[boardTheme as keyof typeof SELECTED_THEMES] ||
    SELECTED_THEMES.wood;
  const hoverColor =
    HOVER_THEMES[boardTheme as keyof typeof HOVER_THEMES] || HOVER_THEMES.wood;
  const board = useMemo(() => game.board(), [game]);
  const squareColors: string[] = [];
  const chess: ReactNode[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = `${String.fromCharCode(97 + col)}${8 - row}` as Square;
      const isLightSquare = (row + col) % 2 === 0;
      const isLegalMove = legalMoves?.some((move) => move.to === square);
      const isPointHere = square === hoverSquare;
      squareColors.push(
        square === selectedSquare ? "#e6c84f"
          : isPointHere ? hoverColor
          : isLegalMove ? (isLightSquare ? selectedTheme.light : selectedTheme.dark)
          : isLightSquare ? theme.light : theme.dark,
      );
    }
  }

  const TILE_SIZE = 1;
  board.map((row, rowIndex) => {
    row.map((piece, colIndex) => {
      if (piece == null) return null;
      const x = (colIndex - 3.5) * TILE_SIZE;
      const z = (rowIndex - 3.5) * TILE_SIZE;

      const colorName = piece.color === "w" ? "White" : "Black";
      const square =
        `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as Square;
      chess.push(
        <Piece
          animateFrom={
            lastMove?.animate && lastMove.to === square ? lastMove : null
          }
          onMoveAnimationEnd={() => {
            setMoveAnimation((current) =>
              current?.gameId === gameId && current.fen === fen
                ? null
                : current,
            );
          }}
          key={`${square}-${piece.color}${piece.type}`}
          type={piece.type}
          color={colorName}
          position={[x, 0.55, z]}
          square={square}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          isDragging={dragFrom === square}
          onDragMove={handleDragMove}
        />,
      );
    });
  });

  const borderMaterial = (
    <meshPhysicalMaterial
      color={theme.border}
      roughness={5.0}
      metalness={1.0}
      clearcoat={0.1}
    />
  );

  return (
    <group position={[0.1, 0, 0]} rotation={[0, 0, 0]} ref={boardRef}>
      <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.8, 0.2, 8.8]} />
        {borderMaterial}
      </mesh>

      {/* Бортики */}
      <mesh position={[0, 0.15, -4.2]} receiveShadow castShadow>
        <boxGeometry args={[8.8, 0.3, 0.4]} />
        {borderMaterial}
      </mesh>
      <mesh position={[0, 0.15, 4.2]} receiveShadow castShadow>
        <boxGeometry args={[8.8, 0.3, 0.4]} />
        {borderMaterial}
      </mesh>
      <mesh position={[-4.2, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 0.3, 8.0]} />
        {borderMaterial}
      </mesh>
      <mesh position={[4.2, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 0.3, 8.0]} />
        {borderMaterial}
      </mesh>

      <BoardTiles colors={squareColors} onSelect={handleSquareClick}
        onMaterial={(material) => { materialRefs.current[0] = material; }} />
      <group>{chess}</group>
      {capturedVisual && (
        <CapturedPiece
          type={capturedVisual.type}
          color={capturedVisual.color}
          square={capturedVisual.square}
        />
      )}
    </group>
  );
}
