import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setGpuWarning } from "@/store/settingsSlice";
import { Button } from "./Button";

export function GPUWarning({ t }: { t: (key: string) => string }) {
  const gpuWarning = useAppSelector((state) => state.settings.gpuWarning);
  const dispatch = useAppDispatch();
  if (!gpuWarning) return null;
  return (
    <div className="fixed inset-0 w-600 z-50 flex items-center justify-center bg-black/70">
      <div className="rounded-xl bg-zinc-900 p-6 text-white">
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
