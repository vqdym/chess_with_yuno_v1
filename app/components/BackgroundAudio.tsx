"use client";
import YouTube from "react-youtube";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";

export function BackgroundAudio() {
  const { masterVolume, musicVolume, rainVolume } = useAppSelector(
    (state) => state.settings,
  );
  const status = useAppSelector((state) => state.gameState.status);

  const jazzId = "MYPVQccHhAQ";
  const rainId = "XhAhviQaxpQ";

  const [jazzPlayer, setJazzPlayer] = useState<any>(null);
  const [rainPlayer, setRainPlayer] = useState<any>(null);

  const handleReadyJazz = (event: any) => {
    setJazzPlayer(event.target);
    event.target.setVolume((musicVolume * masterVolume) / 100);
    event.target.playVideo();
  };

  const handleReadyRain = (event: any) => {
    setRainPlayer(event.target);
    event.target.setVolume((rainVolume * masterVolume) / 100);
    event.target.playVideo();
  };

  useEffect(() => {
    try {
      if (jazzPlayer && typeof jazzPlayer.setVolume === "function") {
        jazzPlayer.setVolume((musicVolume * masterVolume) / 100);
      }
    } catch (error) {
      console.warn("Jazz player iframe not ready");
    }
  }, [jazzPlayer, musicVolume, masterVolume]);

  useEffect(() => {
    try {
      if (rainPlayer && typeof rainPlayer.setVolume === "function") {
        rainPlayer.setVolume((rainVolume * masterVolume) / 100);
      }
    } catch (error) {
      console.warn("Rain player iframe not ready");
    }
  }, [rainPlayer, rainVolume, masterVolume]);

  return (
    <div className="hidden pointer-events-none">
      <YouTube
        videoId={jazzId}
        opts={{
          playerVars: {
            autoplay: 1,
            loop: 1,
            controls: 0,
            playlist: jazzId,
          },
        }}
        onReady={handleReadyJazz}
      />
      {status !== "menu" && (
        <YouTube
          videoId={rainId}
          opts={{
            playerVars: {
              autoplay: 1,
              loop: 1,
              controls: 0,
              playlist: rainId,
            },
          }}
          onReady={handleReadyRain}
        />
      )}
    </div>
  );
}
