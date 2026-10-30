"use client"
import { Button } from "./Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeAngles, changeScene, setIs2D } from "@/store/gameSlice";
import { CAMERA_ANGLES, CHESS_MATERIAL, GAME_SCENE } from "../globals/globals";
import { changeMaterial } from "@/store/chessSlice";

export function SwitchCamera(){
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.gameState.status);
  const result = useAppSelector(state => state.gameState.result);
  const is2D = useAppSelector(state => state.gameState.is2D);
  function handleSwitch() {
    if (is2D) {
      dispatch(setIs2D(false));
      dispatch(changeScene({position: GAME_SCENE.position, target: GAME_SCENE.target}))
      dispatch(changeMaterial({
      roughness: CHESS_MATERIAL.roughness,
      metalness: CHESS_MATERIAL.metalness,
      clearcoat: CHESS_MATERIAL.clearcoat,
      clearcoatRoughness: CHESS_MATERIAL.clearcoatRoughness,
      reflectivity: CHESS_MATERIAL.reflectivity,
      }));
      dispatch(changeAngles({minAzimuthAngle: CAMERA_ANGLES.minAzimuthAngle, maxAzimuthAngle: CAMERA_ANGLES.maxAzimuthAngle, minPolarAngle: CAMERA_ANGLES.minPolarAngle, maxPolarAngle: CAMERA_ANGLES.maxPolarAngle, minDistance: CAMERA_ANGLES.minDistance, maxDistance: CAMERA_ANGLES.maxDistance}))
      return;
    }
    dispatch(setIs2D(true));
    dispatch(changeScene({position: [-4, 8, 4], target: [0, 0, 0]}));
    dispatch(changeMaterial({
      roughness: 10.0,
      metalness: 0.0,
      clearcoat: 0,
      clearcoatRoughness: 1.2,
      reflectivity: 0.2,
    }));
    dispatch(changeAngles({minAzimuthAngle: -Math.PI /2 , maxAzimuthAngle: Math.PI/2, minPolarAngle: Math.PI / 5, maxPolarAngle: Math.PI / 2.1, minDistance: 7, maxDistance: 10}))
    return;
  }
  return (
      <Button style={`bg-[#c7c5c5]/30 hover:bg-[#c7c5c5]/60  px-4 py-2 cursor-pointer text-[#080808] text-[18px] font-bold rounded-xl font-cinzel [text-shadow:0_2px_4px_rgba(0, 0, 0, 0.8)] transition duration-300 ease-in-out hover:translate-y-[-4px] ${status === "paused" || status === "menu" || result != "playing" ? "hidden" : "block"}`} onClick={handleSwitch}>Switch Camera</Button>  
  )
}
