"use client";

import dynamic from "next/dynamic";
import type { YouTubePlayer, YouTubeProps } from "react-youtube";
import { memo, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { usePageVisible } from "../hooks/usePageVisible";

const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

const AudioTrack = memo(function AudioTrack({
  videoId,
  volume,
}: {
  videoId: string;
  volume: number;
}) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const opts = useMemo<YouTubeProps["opts"]>(() => ({
    playerVars: { autoplay: 0, loop: 1, controls: 0, playlist: videoId },
  }), [videoId]);

  useEffect(() => {
    if (!player) return;
    const readyPlayer = player;
    let cancelled = false;
    async function play() {
      try {
        await readyPlayer.setVolume(volume);
        if (!cancelled) await readyPlayer.playVideo();
      } catch {
        // The iframe may be destroyed while its asynchronous API is resolving.
      }
    }
    void play();
    return () => { cancelled = true; };
  }, [player, volume]);

  return <YouTube videoId={videoId} opts={opts} onReady={(event) => setPlayer(event.target)} />;
});

export function BackgroundAudio() {
  const musicVolume = useAppSelector((state) => state.settings.musicVolume * state.settings.masterVolume / 100);
  const rainVolume = useAppSelector((state) => state.settings.rainVolume * state.settings.masterVolume / 100);
  const rainEnabled = useAppSelector((state) => state.gameState.status !== "menu");
  const visible = usePageVisible();
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const activate = () => {
      setActivated(true);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
    window.addEventListener("pointerdown", activate, { passive: true });
    window.addEventListener("keydown", activate);
    return () => {
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, []);

  // Destroy inaudible players instead of streaming muted video in the background.
  if (!activated || !visible) return null;
  return (
    <div className="hidden pointer-events-none" aria-hidden="true">
      {musicVolume > 0 && <AudioTrack videoId="MYPVQccHhAQ" volume={musicVolume} />}
      {rainEnabled && rainVolume > 0 && <AudioTrack videoId="XhAhviQaxpQ" volume={rainVolume} />}
    </div>
  );
}
