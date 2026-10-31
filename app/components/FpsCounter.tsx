"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// Update only this text node once per second, never the React scene tree.
export function FpsCounter() {
  const label = useRef<HTMLDivElement>(null);
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
    const fps = sample.current.frames * 1000 / elapsed;
    if (label.current) {
      label.current.textContent = `${fps.toFixed(1)} FPS`;
      label.current.dataset.fps = fps.toFixed(1);
    }
    sample.current = { start: now, frames: 0 };
  });
  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <div ref={label} data-testid="fps-counter" className="absolute left-4 top-4 rounded bg-black/70 px-3 py-2 font-mono text-sm text-white">
        — FPS
      </div>
    </Html>
  );
}
