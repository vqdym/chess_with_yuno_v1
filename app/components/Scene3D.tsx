"use client";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  CameraControlsImpl,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  SelectiveBloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { ChessBoard } from "./ChessBoard";
import { Restaurant } from "./Restaurant";
import { Model as Yuno } from "../Yuno/Yuno";
import { useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePageVisible } from "../hooks/usePageVisible";
import { GRAPHICS_PRESETS } from "../globals/graphics";
import { FpsSampler } from "./FpsCounter";

const MAGIC_BLOOM_INTENSITY = 10;
const LAMP_POSITIONS: [number, number, number][] = [
  [36, 29, -30],
  [36, 29, -48.5],
  [18.2, 29, -30.2],
  [18.2, 29, -48.5],
  [0.2, 29, -30.2],
  [0.2, 29, -48.5],
];

export function Scene3D() {
  const { position, target } = useAppSelector(
    (state) => state.gameState.gameScene,
  );
  const status = useAppSelector((state) => state.gameState.status);
  const result = useAppSelector((state) => state.gameState.result);
  const is2D = useAppSelector((state) => state.gameState.is2D);
  const visible = usePageVisible();
  const graphicsQuality = useAppSelector((state) => state.settings.graphicsQuality);
  const showFps = useAppSelector((state) => state.settings.showFps);
  const quality = GRAPHICS_PRESETS[graphicsQuality];
  const {
    minAzimuthAngle,
    maxAzimuthAngle,
    minPolarAngle,
    maxPolarAngle,
    minDistance,
    maxDistance,
  } = useAppSelector((state) => state.gameState.cameraAngles);
  const [controls, setControls] = useState<CameraControlsImpl | null>(null);
  const [stockfishMove, setStockfishMove] = useState(0);
  const onStockfishMove = useCallback(() => setStockfishMove((n) => n + 1), []);
  const [magicMeshes, setMagicMeshes] = useState<THREE.Object3D[]>([]);
  const [bloomLights, setBloomLights] = useState<THREE.Light[]>([]);
  const registerBloomLight = useCallback((light: THREE.Light | null) => {
    if (!light) return;
    setBloomLights((current) =>
      current.includes(light) ? current : [...current, light],
    );
    return () =>
      setBloomLights((current) => current.filter((item) => item !== light));
  }, []);
  const [isDraggingPiece, setIsDraggingPiece] = useState(false);
  const initialized = useRef(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  useEffect(() => {
    const onKeyChange = (event: KeyboardEvent) => setCtrlPressed(event.ctrlKey);
    const onBlur = () => setCtrlPressed(false);

    window.addEventListener("keydown", onKeyChange);
    window.addEventListener("keyup", onKeyChange);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyChange);
      window.removeEventListener("keyup", onKeyChange);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    if (!controls) return;
    controls.zoomTo(1, false);
    controls.setLookAt(...position, ...target, initialized.current);
    initialized.current = true;
  }, [controls, target, position]);

  const cameraDisabled =
    status === "menu" || status === "paused" || result != "playing";

  return (
    <Canvas
      shadows="percentage"
      dpr={quality.dpr}
      frameloop={visible ? "always" : "never"}
      camera={{ position: position, fov: 45 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
    >
      {visible && showFps && <FpsSampler key={graphicsQuality} />}
      <CameraControls
        ref={setControls}
        minAzimuthAngle={minAzimuthAngle}
        maxAzimuthAngle={maxAzimuthAngle}
        minPolarAngle={minPolarAngle}
        minZoom={1}
        maxZoom={1}
        mouseButtons={{
          left: CameraControlsImpl.ACTION.ROTATE,
          middle: CameraControlsImpl.ACTION.DOLLY,
          right:
            is2D && ctrlPressed
              ? CameraControlsImpl.ACTION.NONE
              : CameraControlsImpl.ACTION.TRUCK,
          wheel: CameraControlsImpl.ACTION.DOLLY,
        }}
        maxPolarAngle={maxPolarAngle}
        minDistance={minDistance}
        maxDistance={maxDistance}
        makeDefault
        enabled={!cameraDisabled && !isDraggingPiece}
      />

      <Environment preset="night" background blur={0.5} />
      <ambientLight ref={registerBloomLight} intensity={0.18} color="#ffe4c4" />
      <hemisphereLight ref={registerBloomLight} args={["#ffe6c7", "#493025", 0.25]} />

      <group rotation={[0, Math.PI / 2, 0]}>
        <Restaurant />
        <ChessBoard
          onDraggingChange={setIsDraggingPiece}
          onStockfishMove={onStockfishMove}
        />

        <pointLight
          key={quality.shadowSize}
          ref={registerBloomLight}
          position={[0, 12, 0]}
          intensity={350}
          distance={30}
          color="#ff7722"
          castShadow={quality.shadows}
          shadow-mapSize-width={quality.shadowSize}
          shadow-mapSize-height={quality.shadowSize}
        />

        <pointLight
          ref={registerBloomLight}
          position={[38, 10, 0]}
          intensity={600}
          distance={30}
          color="#ff7722"
        />

        {LAMP_POSITIONS.map((position, index) => (
          <pointLight
            key={`ceiling-lamp-${index}`}
            ref={registerBloomLight}
            position={position}
            color="#ff7722"
            intensity={1}
            distance={10}
            castShadow={false}
          />
        ))}

        <Yuno
          moveTrigger={stockfishMove}
          onMagicMeshesReady={setMagicMeshes}
          position={[11.65, -11, 0]}
          scale={15}
          rotation={[0, -1.6, 0]}
        />
      </group>
      {quality.effects && <EffectComposer multisampling={quality.samples}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={1}
          luminanceSmoothing={0.1}
          resolutionScale={quality.bloomScale}
        />

        <SelectiveBloom
          selection={magicMeshes}
          selectionLayer={11}
          lights={bloomLights}
          ignoreBackground
          intensity={MAGIC_BLOOM_INTENSITY}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.2}
          resolutionScale={quality.bloomScale}
        />

        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.25} darkness={0.35} />
      </EffectComposer>}
    </Canvas>
  );
}
