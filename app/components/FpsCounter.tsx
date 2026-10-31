"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useSyncExternalStore } from "react";
import { useAppSelector } from "@/store/hooks";
import { usePageVisible } from "../hooks/usePageVisible";

let currentFps = 0;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
const getSnapshot = () => currentFps;
const getServerSnapshot = () => 0;
const subscribeHydration = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

// Measure actual scene frames; publish once per second without rerendering the scene.
export function FpsSampler() {
  const sample = useRef({ start: 0, frames: 0 });
  useFrame(() => {
    const now = performance.now();
    if (!sample.current.start) {
      sample.current.start = now;
      return;
    }
    sample.current.frames++;
    const elapsed = now - sample.current.start;
    if (elapsed < 1000) return;
    currentFps = Math.round(sample.current.frames * 10000 / elapsed) / 10;
    listeners.forEach((listener) => listener());
    sample.current = { start: now, frames: 0 };
  });
  return null;
}

// Ordinary page UI, outside Canvas: camera position and projection cannot move it.
export function FpsCounter() {
  const enabled = useAppSelector((state) => state.settings.showFps);
  const visible = usePageVisible();
  const fps = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeHydration, getClientReady, getServerReady);
  if (!ready || !enabled) return null;
  return (
    <div data-testid="fps-counter" data-fps={visible ? fps : 0}
      className="pointer-events-none absolute left-4 top-4 z-20 rounded bg-black/70 px-3 py-2 font-mono text-sm text-white">
      {visible && fps > 0 ? fps.toFixed(1) : "—"} FPS
    </div>
  );
}
