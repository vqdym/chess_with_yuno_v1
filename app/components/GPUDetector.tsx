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

    if (!extension) {
      dispatch(setGpuWarning(undefined));
      return;
    }

    const gpuName = String(
      context.getParameter(
        extension.UNMASKED_RENDERER_WEBGL
      )
    );

    // Renderer names are only a heuristic. An unmatched name is unknown,
    // not proof that the browser is using a dedicated GPU.
    const isLikelyIntegrated =
      /Intel.*(UHD|HD Graphics|Iris)/i.test(gpuName) ||
      /AMD Radeon\(TM\) Graphics/i.test(gpuName);

    dispatch(setGpuWarning(isLikelyIntegrated ? gpuName : undefined));
  }, [gl, dispatch]);

  return null;
}
