import { DialogChoose } from "@/app/enums/DialogChoose";
import { CAMERA_ANGLES } from "@/app/globals/globals";
import { Difficulty } from "@/app/types/Difficulty";
import { Result } from "@/app/types/Result";
import {Status} from "@/app/types/Status";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chess, Square } from "chess.js";

const difficulty = {
  "Easy": 0,
  "Normal": 2,
  "Tricky": 4,
  "Challenging": 6,
  "Hard": 8,
  "Very hard": 10,
  "Expert": 12,
  "Master": 14,
  "Nightmare": 17,
  "Impossible": 20,
}

interface IGameScene {
  position: [number,number,number];
  target: [number,number,number];
}

interface ICameraAngles {
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minDistance: number;
  maxDistance: number;
}

interface IInitialState {
  gameScene: IGameScene;
  cameraAngles: ICameraAngles;
  status: Status;
  playerTurn: number,
  fen: string;
  result: Result;
  hoverSquare: Square | null;
  selectedSquare: Square | null;
  lastMove: { from: Square; to: Square; animate: boolean } | null;
  gameId: number;
  dialogTrigger: DialogChoose;
  laughTrigger: number;
  hmphTrigger: number;
  is2D: boolean;
  difficulty: number;
}

const initialState: IInitialState = {
  gameScene: {
    position: [-3, 1.5, -0.1],
    target: [-2, 1.6, -0.1],
  },
  cameraAngles: {
    minAzimuthAngle: CAMERA_ANGLES.minAzimuthAngle,
    maxAzimuthAngle: CAMERA_ANGLES.maxAzimuthAngle ,
    minPolarAngle: CAMERA_ANGLES.minPolarAngle,
    maxPolarAngle: CAMERA_ANGLES.maxPolarAngle,
    minDistance: CAMERA_ANGLES.minDistance,
    maxDistance: CAMERA_ANGLES.maxDistance,
  },
  status: "menu",
  playerTurn: 0,
  fen: new Chess().fen(),
  result: "playing",
  hoverSquare: null,
  selectedSquare: null,
  lastMove: null,
  gameId: 0,
  dialogTrigger: DialogChoose.Playing,
  laughTrigger: 0,
  hmphTrigger: 0,
  is2D: false,
  difficulty: 2,
}

export const gameSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
  playGame: (state, action: PayloadAction<{ view: IGameScene; status: Status}>) => {
    state.gameId += 1;
    state.gameScene.position = action.payload.view.position;
    state.gameScene.target = action.payload.view.target; 
    state.status = action.payload.status;
    state.playerTurn = Math.round(Math.random());
    state.fen = new Chess().fen();
    state.result = "playing";
    Object.assign(state.cameraAngles, initialState.cameraAngles);
    state.lastMove = null;
    state.is2D = false;
  },
  endGame: (state) => {
    state.gameScene.position = [...initialState.gameScene.position];
    state.gameScene.target = [...initialState.gameScene.target];
    state.status = "leaving";
    state.fen = new Chess().fen();
    state.result = "playing";
    state.hoverSquare = null;
    state.selectedSquare = null;
    state.lastMove = null;
    state.is2D = false;
  },
  changeStatus: (state, action: PayloadAction<{status: Status}>) => {
    state.status = action.payload.status;
  },
  changeScene: (state, action: PayloadAction<{position: [number, number, number], target: [number, number,number]}>) => {
    state.gameScene.position = action.payload.position;
    state.gameScene.target = action.payload.target;
  },
  changeAngles: (state, action: PayloadAction<ICameraAngles>) => {
    Object.assign(state.cameraAngles, action.payload);
  },
  setHoverSquare: (state, action: PayloadAction<Square | null>) => {
    state.hoverSquare = action.payload;
  },
  setSelectedSquare: (state, action: PayloadAction<Square | null>) => {
    state.selectedSquare = action.payload;
  },
  setResult: (state, action: PayloadAction<Result>) => {
    state.result = action.payload;
  },
  setDialogTrigger: (state, action: PayloadAction<DialogChoose>) => {
    state.dialogTrigger = action.payload;
  },
  setLaughTrigger: (state, action: PayloadAction<number>) => {
    state.laughTrigger = action.payload;
  },
  setHmphTrigger: (state, action: PayloadAction<number>) => {
    state.hmphTrigger = action.payload;
  },
  setIs2D: (state, action: PayloadAction<boolean>) => {
    state.is2D = action.payload;
  },
  makeMove: (
  state,
  action: PayloadAction<{ from: Square; to: Square; promotion?: string, animate?: boolean }>
) => {
  const game = new Chess(state.fen);
  const move = game.move({
    from: action.payload.from,
    to: action.payload.to,
    promotion: action.payload.promotion,
  });
  state.fen = game.fen();
  state.lastMove = {
    from: move.from,
    to: move.to,
    animate: action.payload.animate ?? true,
  }

  const playerColor = state.playerTurn === 0 ? "w" : "b";

  if (game.isCheckmate()) {
    state.result = game.turn() === playerColor ? "lose" : "win";
  } else if (game.isDraw()) {
    state.result = "draw";
  }
},
  changeDifficulty: (state, action: PayloadAction<{difficulty: Difficulty}>) => {
    state.difficulty = difficulty[action.payload.difficulty];
  } 
}
});

export const {playGame, endGame, changeStatus, changeScene, changeAngles, setHoverSquare, setSelectedSquare, setDialogTrigger, setLaughTrigger,setHmphTrigger, setIs2D, makeMove, setResult, changeDifficulty} = gameSlice.actions;
export default gameSlice.reducer;
