"use client";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

interface GPUDetectorProps {
  onIntegratedGPU: (gpuName: string) => void;
}

export function GPUDetector({
  onIntegratedGPU,
}: GPUDetectorProps) {
  const { gl } = useThree();

  useEffect(() => {
    const context = gl.getContext();

    const extension = context.getExtension(
      "WEBGL_debug_renderer_info"
    );

    if (!extension) return;

    const gpuName = String(
      context.getParameter(
        extension.UNMASKED_RENDERER_WEBGL
      )
    );

    console.log("Current GPU:", gpuName);

    const isIntegrated =
      /Intel.*(UHD|HD Graphics|Iris)/i.test(gpuName) ||
      /AMD Radeon\(TM\) Graphics/i.test(gpuName);

    if (isIntegrated) {
      onIntegratedGPU(gpuName);
    }
  }, [gl, onIntegratedGPU]);

  return null;
}