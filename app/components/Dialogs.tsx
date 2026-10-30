"use client"
import { changeScene, changeStatus, endGame, playGame, setDialogTrigger, setHmphTrigger, setHoverSquare, setLaughTrigger, setSelectedSquare } from "@/store/gameSlice";
import { TextKey, useT } from "../hooks/useT";
import { Button } from "./Button";
import { DialogWindow } from "./DialogWindow";
import { GAME_SCENE } from "../globals/globals";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Typewriter } from "./Typewritter";
import { DialogChoose } from "../enums/DialogChoose";

const VARIANTS = { win: 3, lose: 3, draw: 2 } as const;
const LAUGH_SOUNDS = 11;
const HMPH_SOUNDS = 2;
const LAUGH_FADE_OUT_SECONDS = 1.5;

export function Dialogs() {
  const t = useT();
  const dispatch = useAppDispatch();
  const result = useAppSelector((s) => s.gameState.result);
  const [endDialog, setEndDialog] = useState<{
    result: keyof typeof VARIANTS;
    variant: number;
  } | null>(null);

  useEffect(() => {
    if (result === "playing") return;
    let audio: HTMLAudioElement | undefined;
    let hmph: HTMLAudioElement | undefined;
    const fadeOut = () => {
      if (!audio || !Number.isFinite(audio.duration)) return;
      const secondsLeft = audio.duration - audio.currentTime;
      audio.volume = Math.max(0, Math.min(1, secondsLeft / LAUGH_FADE_OUT_SECONDS));
    };
    if (result === "lose") {
      dispatch(setLaughTrigger(1));
      const randomSound = Math.floor(Math.random() * LAUGH_SOUNDS) + 1;
      audio = new Audio(`/sounds/laugh/laugh-${randomSound}.mp3`)
      audio.addEventListener("timeupdate", fadeOut);
      audio.play().catch(error => console.warn("Could not play laugh:", error));
      
    }
    if (result === "win") {
      dispatch(setHmphTrigger(1));
      const randomSound = Math.floor(Math.random() * HMPH_SOUNDS) + 1;
      hmph = new Audio(`/sounds/hmph/hmph_${randomSound}.mp3`)
      hmph.play().catch(error => console.warn("Could not play hmph:", error));
    }
    let dialogAudio: HTMLAudioElement | undefined;
    const id = setTimeout(() => {
      const variant = Math.floor(Math.random() * VARIANTS[result]) + 1;
      setEndDialog({
        result,
        variant,
      });
      dialogAudio = new Audio(`/sounds/${result}_dialog/${result}${variant}.mp3`)
      dialogAudio.play().catch(error => console.warn("Could not play dialog:", error));
      dispatch(setDialogTrigger(result === "lose" ? DialogChoose.Lose : (result === "draw" ? DialogChoose.Draw :  DialogChoose.Win)));
      dispatch(changeScene({position: [0,4.3,0], target: [0,4.29,-0.1]}))

    }, 3000);


    return () => {
      clearTimeout(id);
      dispatch(setLaughTrigger(0));
      dispatch(setDialogTrigger(DialogChoose.Playing));
      if (audio) {
        audio.removeEventListener("timeupdate", fadeOut);
        audio.pause();
        audio.currentTime = 0;
      }
      if (dialogAudio) {
        dialogAudio.pause();
        dialogAudio.currentTime = 0;
      }
    }
  }, [result, dispatch])


  const btn =
    "cursor-pointer text-settings-button font-bold font-philosopher tracking-widest transition duration-300 hover:-translate-y-1 hover:text-settings-button";

  const handlePlayAgain = () => {
    dispatch(
      playGame({
        view: { position: GAME_SCENE.position, target: GAME_SCENE.target },
        status: "started",
      })
    );
    dispatch(setSelectedSquare(null));
    dispatch(setHoverSquare(null));
    dispatch(setLaughTrigger(0));
    dispatch(setHmphTrigger(0));
    dispatch(setDialogTrigger(DialogChoose.Playing));
    setEndDialog(null);
  };

  const handleLeave = () => {
    dispatch(endGame());
    dispatch(changeStatus({ status: "menu" }));
    dispatch(setSelectedSquare(null));
    dispatch(setHoverSquare(null));
    dispatch(setLaughTrigger(0));
    dispatch(setHmphTrigger(0));
    dispatch(setDialogTrigger(DialogChoose.Playing));
    setEndDialog(null);
  };

  if (!endDialog || endDialog.result !== result) return null;
  return (
    <DialogWindow>
<>
        <p className="font-marckscript text-[40px] text-white [text-shadow:0_4px_8px_rgba(0,0,0,0.8)]">
          {t("dialog.speaker")}
        </p>

        <p className="mt-2 min-h-[72px] font-philosopher text-[28px] leading-relaxed">
          <Typewriter text={t(`dialog.${result}${endDialog.variant}` as TextKey)}/>
        </p>

        <div className="mt-6 flex justify-end gap-12 pt-4">
          <Button style={`${btn} text-[24px]`} onClick={handlePlayAgain}>
            {t("dialog.playAgain")}
          </Button>
          <Button style={`${btn} text-[20px] opacity-80`} onClick={handleLeave}>
            {t("dialog.leave")}
          </Button>
        </div>
      
</>
    </DialogWindow>
  );
}
