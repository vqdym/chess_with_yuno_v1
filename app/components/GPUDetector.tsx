"use client";
import { useAppDispatch } from "@/store/hooks";
import { setGpuWarning } from "@/store/settingsSlice";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";


export function GPUDetector() {
  const { gl } = useThree();
  const dispatch = useAppDispatch();
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
      dispatch(setGpuWarning(gpuName));
    }
  }, [gl, dispatch]);

  return null;
}