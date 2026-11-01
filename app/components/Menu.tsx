"use client";
import { Button } from "./Button";
import { changeStatus, endGame, playGame } from "@/store/gameSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  type Language,
  LANGUAGES,
  setBoardTheme,
  setLanguage,
  setMasterVolume,
  setMusicVolume,
  setRainVolume,
  setVoiceEffectsVolume,
  setGraphicsQuality,
  setShowFps,
  setGpuWarning,
} from "@/store/settingsSlice";
import { GAME_SCENE } from "../globals/globals";
import { useT } from "../hooks/useT";
import { DifficultySlider } from "./DifficultySlider";
import type { Theme } from "../types/Theme";
import { GRAPHICS_LEVELS, isGraphicsQuality } from "../globals/graphics";

const BOARD_THEMES = ["wood", "green", "blue", "gray"] as const;
const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  uk: "Українська",
};

export function Menu() {
  const t = useT();
  const dispatch = useAppDispatch();
  const {
    masterVolume,
    musicVolume,
    rainVolume,
    voiceEffectsVolume,
    boardTheme,
    language,
    graphicsQuality,
    showFps,
  } = useAppSelector((state) => state.settings);
  const status = useAppSelector((state) => state.gameState.status);
  const result = useAppSelector((state) => state.gameState.result);
  const gpuWarning = useAppSelector((state) => state.settings.gpuWarning);

  const [buttonMode, setButtonMode] = useState<"play" | "leave">("play");

  const scriptFont = language === "uk" ? "font-marckscript" : "font-pinyon";
  const serifFont = language === "uk" ? "font-philosopher" : "font-cinzel";

  useEffect(() => {
    if (status === "menu") setButtonMode("play");
    if (status === "paused") setButtonMode("leave");
  }, [status]);

  useEffect(() => {
    if (result != "playing") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status === "started")
        dispatch(changeStatus({ status: "paused" }));
      if (e.key === "Escape" && status === "paused")
        dispatch(changeStatus({ status: "started" }));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, dispatch]);

  const handlePlayClick = () => {
    dispatch(
      playGame({
        view: { position: GAME_SCENE.position, target: GAME_SCENE.target },
        status: "started",
      }),
    );
  };

  const handleLeaveClick = () => {
    dispatch(endGame());
    dispatch(changeStatus({ status: "menu" }));
  };

  const handleResumeClick = () => {
    dispatch(changeStatus({ status: "started" }));
  };

  const isMenuHidden = status === "started" || status === "leaving";

  return (
    <div
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50 ${isMenuHidden ? "opacity-0 invisible" : "opacity-100 visible"} transition duration-300 ease-in-out`}
    >
      {gpuWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="rounded-xl bg-zinc-900 p-6 text-white">
            <h2 className="text-xl font-bold">{t("gpuWarning.title")}</h2>

            <p className="mt-3">
              {t("gpuWarning.renderer")}
              <br />
              {gpuWarning}
            </p>

            <p className="mt-3 text-sm text-zinc-400">
              {t("gpuWarning.advice")}
            </p>

            <button
              onClick={() => dispatch(setGpuWarning(undefined))}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-black"
            >
              {t("gpuWarning.continue")}
            </button>
          </div>
        </div>
      )}
      <div className="absolute top-[15%]">
        <h1
          className={`text-white text-[96px] font-pinyon [text-shadow:0_4px_8px_rgba(42,14,16,0.8)]`}
        >
          Chess With Yuno
        </h1>
      </div>

      <div className="flex flex-col gap-4 items-center">
        {buttonMode === "leave" ? (
          <>
            <Button
              style={`cursor-pointer text-play-button text-[48px] font-bold rounded ${serifFont} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] transition duration-300 ease-in-out hover:translate-y-[-4px]`}
              onClick={handleResumeClick}
            >
              {t("menu.resumeBut")}
            </Button>
            <Button
              style={`cursor-pointer text-play-button text-[32px] font-bold rounded ${serifFont} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] transition duration-300 ease-in-out hover:translate-y-[-4px]`}
              onClick={handleLeaveClick}
            >
              {t("menu.leaveGameBut")}
            </Button>
          </>
        ) : (
          <>
            <Button
              style={`cursor-pointer text-play-button text-[48px] font-bold rounded ${serifFont} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] transition duration-300 ease-in-out hover:translate-y-[-4px]`}
              onClick={handlePlayClick}
            >
              {t("menu.playBut")}
            </Button>
            <DifficultySlider language={language} font={serifFont} />
          </>
        )}
        <Modal>
          <Modal.Window name="settingsModal">
            <div className="w-[600px] max-h-[85vh] bg-settings-button/90 backdrop-blur-md border border-play-button/30 rounded-xl p-8 shadow-[0_0_40px_rgba(20,5,8,0.9)] flex flex-col gap-8 text-play-button relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              <h2
                className={`text-center text-[56px] ${scriptFont} text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.8)] drop-shadow-md z-10`}
              >
                {t("settings.title")}
              </h2>

              <div className="flex flex-col gap-8 z-10 flex-1 min-h-0 overflow-y-auto pr-3 [scrollbar-width:thin] [scrollbar-color:rgba(249,228,183,0.4)_transparent]">
                <section
                  className="flex flex-col gap-4"
                  aria-labelledby="graphics-heading"
                >
                  <h3
                    id="graphics-heading"
                    className={`text-[24px] ${serifFont} uppercase font-bold tracking-widest border-b border-play-button/20 pb-2 mb-2 text-white/90`}
                  >
                    {t("settings.graphics.title")}
                  </h3>
                  <div className="flex justify-between items-center gap-4">
                    <label
                      htmlFor="graphics-quality"
                      className={`${serifFont} text-[18px] tracking-wide`}
                    >
                      {t("settings.graphics.quality")}
                    </label>
                    <select
                      id="graphics-quality"
                      value={graphicsQuality}
                      onChange={(event) => {
                        if (isGraphicsQuality(event.target.value))
                          dispatch(setGraphicsQuality(event.target.value));
                      }}
                      className={`w-[200px] bg-settings-button border border-play-button/30 rounded px-3 py-1 ${serifFont} text-play-button cursor-pointer focus:outline-none focus:border-play-button`}
                    >
                      {GRAPHICS_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {t(`settings.graphics.levels.${level}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-play-button/75">
                    {t(`settings.graphics.descriptions.${graphicsQuality}`)}
                  </p>
                  <label
                    className={`flex justify-between items-center ${serifFont} text-[18px]`}
                  >
                    {t("settings.graphics.showFps")}
                    <input
                      type="checkbox"
                      checked={showFps}
                      onChange={(event) =>
                        dispatch(setShowFps(event.target.checked))
                      }
                      className="h-4 w-4 accent-play-button"
                    />
                  </label>
                </section>
                <div className="flex flex-col gap-4">
                  <h3
                    className={`text-[24px] ${serifFont} uppercase font-bold tracking-widest border-b border-play-button/20 pb-2 mb-2 text-white/90`}
                  >
                    {t("settings.audio.title")}
                  </h3>

                  <div className="flex justify-between items-center group">
                    <span
                      className={`${serifFont} text-[18px] tracking-wide transition-colors group-hover:text-white`}
                    >
                      {t("settings.audio.masterVolume")}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={masterVolume}
                      onChange={(e) =>
                        dispatch(
                          setMasterVolume({
                            masterVolume: Number(e.target.value),
                          }),
                        )
                      }
                      className="w-[200px] h-1 bg-play-button/20 rounded-lg appearance-none cursor-pointer accent-play-button"
                    />
                  </div>

                  <div className="flex justify-between items-center group">
                    <span
                      className={`${serifFont} text-[18px] tracking-wide transition-colors group-hover:text-white`}
                    >
                      {t("settings.audio.music")}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) =>
                        dispatch(
                          setMusicVolume({
                            musicVolume: Number(e.target.value),
                          }),
                        )
                      }
                      className="w-[200px] h-1 bg-play-button/20 rounded-lg appearance-none cursor-pointer accent-play-button"
                    />
                  </div>
                  <div className="flex justify-between items-center group">
                    <span
                      className={`${serifFont} text-[18px] tracking-wide transition-colors group-hover:text-white`}
                    >
                      {t("settings.audio.rain")}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={rainVolume}
                      onChange={(e) =>
                        dispatch(
                          setRainVolume({ rainVolume: Number(e.target.value) }),
                        )
                      }
                      className="w-[200px] h-1 bg-play-button/20 rounded-lg appearance-none cursor-pointer accent-play-button"
                    />
                  </div>
                  <div className="flex justify-between items-center group">
                    <label
                      htmlFor="voice-effects-volume"
                      className={`${serifFont} text-[18px] tracking-wide transition-colors group-hover:text-white`}
                    >
                      {t("settings.audio.voiceEffects")}
                    </label>
                    <input
                      id="voice-effects-volume"
                      type="range"
                      min="0"
                      max="100"
                      value={voiceEffectsVolume}
                      onChange={(e) =>
                        dispatch(
                          setVoiceEffectsVolume({
                            voiceEffectsVolume: Number(e.target.value),
                          }),
                        )
                      }
                      className="w-[200px] h-1 bg-play-button/20 rounded-lg appearance-none cursor-pointer accent-play-button"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3
                    className={`text-[24px] ${serifFont} font-bold tracking-widest border-b border-play-button/20 pb-2 mb-2 text-white/90 uppercase`}
                  >
                    {t("settings.chessboard.title")}
                  </h3>
                  <div className="flex justify-between items-center group">
                    <span
                      className={`${serifFont} text-[18px] tracking-wide transition-colors group-hover:text-white`}
                    >
                      {t("settings.chessboard.boardTheme")}
                    </span>
                    <select
                      value={boardTheme}
                      onChange={(e) =>
                        dispatch(
                          setBoardTheme({
                            boardTheme: e.target.value as Theme,
                          }),
                        )
                      }
                      className={`w-[200px] bg-settings-button border border-play-button/30 rounded px-3 py-1 ${serifFont} text-play-button cursor-pointer focus:outline-none focus:border-play-button`}
                    >
                      {BOARD_THEMES.map((theme) => (
                        <option key={theme} value={theme}>
                          {t(`settings.chessboard.boardThemes.${theme}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3
                    className={`text-[24px] ${serifFont} uppercase font-bold tracking-widest border-b border-play-button/20 pb-2 mb-2 text-white/90`}
                  >
                    {t("settings.language.title")}
                  </h3>
                  <div className="flex justify-between items-center group">
                    <span
                      className={`${serifFont} text-[18px] tracking-wide transition-colors group-hover:text-white`}
                    >
                      {t("settings.language.title")}
                    </span>
                    <select
                      value={language}
                      onChange={(e) =>
                        dispatch(
                          setLanguage({ language: e.target.value as Language }),
                        )
                      }
                      className={`w-[200px] bg-settings-button border border-play-button/30 rounded px-3 py-1 ${serifFont} text-play-button cursor-pointer focus:outline-none focus:border-play-button`}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {t(`settings.language.${lang}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center z-10">
                <Modal.Close>
                  <Button
                    style={`cursor-pointer text-play-button text-[24px] font-bold rounded ${serifFont} tracking-widest [text-shadow:0_4px_8px_rgba(0,0,0,0.8)] transition duration-300 ease-in-out hover:translate-y-[-4px] hover:text-white hover:drop-shadow-[0_0_8px_rgba(249,228,183,0.8)]`}
                  >
                    {t("settings.exitBut")}
                  </Button>
                </Modal.Close>
              </div>
            </div>
          </Modal.Window>
          <Modal.Open opens="settingsModal">
            <Button
              style={`cursor-pointer text-settings-button text-[32px] font-bold rounded ${serifFont} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] transition duration-300 ease-in-out hover:translate-y-[-4px]`}
            >
              {t("menu.settingsBut")}
            </Button>
          </Modal.Open>
        </Modal>
      </div>
    </div>
  );
}
