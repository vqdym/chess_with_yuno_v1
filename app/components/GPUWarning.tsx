import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setGpuWarning } from "@/store/settingsSlice";
import { Button } from "./Button";
import type { TextKey } from "../hooks/useT";

export function GPUWarning({ t }: { t: (key: TextKey) => string }) {
  const gpuWarning = useAppSelector((state) => state.settings.gpuWarning);
  const dispatch = useAppDispatch();
  if (!gpuWarning) return null;
  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-[600px] max-h-[calc(100dvh-2rem)] overflow-y-auto break-words rounded-xl bg-zinc-900 p-6 text-white">
        <h2 className="text-xl font-bold">{t("gpuWarning.title")}</h2>

        <p className="mt-3">
          {t("gpuWarning.renderer")}
          <br />
          {gpuWarning}
        </p>

        <p className="mt-3 text-sm text-zinc-400">{t("gpuWarning.advice")}</p>

        <Button
          onClick={() => dispatch(setGpuWarning(undefined))}
          style="mt-4 rounded-lg cursor-pointer bg-white px-4 py-2 text-black"
        >
          {t("gpuWarning.continue")}
        </Button>
      </div>
    </div>
  );
}
