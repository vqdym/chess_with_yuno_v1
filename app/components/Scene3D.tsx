"use client";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  CameraControlsImpl,
  Environment,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
import {
  EffectComposer,
  SelectiveBloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { ChessBoard } from "./ChessBoard";
import { Restaurant } from "./Restaurant";
import { Model as Yuno } from "../Yuno/Yuno";
import { useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePageVisible } from "../hooks/usePageVisible";

// Ring halo only: 0 disables it; raise gradually for a stronger glow.
const MAGIC_BLOOM_INTENSITY = 10;

export function Scene3D() {
  const { position, target } = useAppSelector(
    (state) => state.gameState.gameScene,
  );
  const status = useAppSelector((state) => state.gameState.status);
  const result = useAppSelector((state) => state.gameState.result);
  const is2D = useAppSelector((state) => state.gameState.is2D);
  const visible = usePageVisible();
  const [quality, setQuality] = useState(2);
  const lowerQuality = useCallback(() => setQuality((level) => Math.max(0, level - 1)), []);
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
    // Also reset zoom left over from Ctrl + wheel before these limits were applied.
    controls.zoomTo(1, false);
    controls.setLookAt(...position, ...target, initialized.current);
    initialized.current = true;
  }, [controls, target, position]);

  const cameraDisabled =
    status === "menu" || status === "paused" || result != "playing";

  return (
    <Canvas
      shadows={quality > 0}
      dpr={quality === 2 ? 1 : quality === 1 ? 0.85 : 0.65}
      frameloop={visible ? "always" : "never"}
      camera={{ position: position, fov: 45 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
    >
      {visible && quality > 0 && (
        <PerformanceMonitor
          key={quality}
          bounds={() => [40, 55]}
          ms={500}
          iterations={10}
          onDecline={lowerQuality}
        />
      )}
      <CameraControls
        ref={setControls}
        minAzimuthAngle={minAzimuthAngle}
        maxAzimuthAngle={maxAzimuthAngle}
        minPolarAngle={minPolarAngle}
        // Ctrl + wheel forces optical zoom in camera-controls, independently of wheel mode.
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

      <Environment preset="night" background blur={0.4} />
      <ambientLight ref={registerBloomLight} intensity={0.1} />

      <group rotation={[0, Math.PI / 2, 0]}>
        <Restaurant />
        <ChessBoard
          onDraggingChange={setIsDraggingPiece}
          onStockfishMove={onStockfishMove}
        />

        <pointLight
          ref={registerBloomLight}
          position={[0, 12, 0]}
          intensity={350}
          distance={30}
          color="#ff7722"
          castShadow
        />

        <pointLight
          ref={registerBloomLight}
          position={[38, 10, 0]}
          intensity={600}
          distance={30}
          color="#ff7722"
        />

        <pointLight
          ref={registerBloomLight}
          position={[36, 29, -30]}
          intensity={1}
          distance={10}
          color="#ff7722"
        />
        <pointLight
          ref={registerBloomLight}
          position={[36, 29, -48.5]}
          intensity={1}
          distance={10}
          color="#ff7722"
        />
        <pointLight
          ref={registerBloomLight}
          position={[18.2, 29, -30.2]}
          intensity={1}
          distance={10}
          color="#ff7722"
        />
        <pointLight
          ref={registerBloomLight}
          position={[18.2, 29, -48.5]}
          intensity={1}
          distance={10}
          color="#ff7722"
        />
        <pointLight
          ref={registerBloomLight}
          position={[0.2, 29, -30.2]}
          intensity={1}
          distance={10}
          color="#ff7722"
        />
        <pointLight
          ref={registerBloomLight}
          position={[0.2, 29, -48.5]}
          intensity={1}
          distance={10}
          color="#ff7722"
        />

        <Yuno
          moveTrigger={stockfishMove}
          onMagicMeshesReady={setMagicMeshes}
          position={[11.65, -11, 0]}
          scale={15}
          rotation={[0, -1.6, 0]}
        />
      </group>
      {quality === 2 && <EffectComposer multisampling={0}>
        <SelectiveBloom
          // Inverted selection excludes only Yuno's FX meshes from bloom.
          selection={magicMeshes}
          inverted
          lights={bloomLights}
          intensity={10}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.7}
          resolutionScale={0.5}
        />

        <SelectiveBloom
          selection={magicMeshes}
          selectionLayer={11}
          lights={bloomLights}
          ignoreBackground
          intensity={MAGIC_BLOOM_INTENSITY}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.2}
          resolutionScale={0.5}
        />

        <Vignette eskil={false} offset={0.3} darkness={0.6} />

        <Noise opacity={0.01} />
      </EffectComposer>}
    </Canvas>
  );
}
