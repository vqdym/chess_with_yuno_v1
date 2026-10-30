"use client"
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const { progress } = useProgress();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setIsHidden(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (isHidden) return null;

  return (
    <div 
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-settings-button transition-opacity duration-700 ease-in-out ${
        progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <h2 className="text-play-button text-[48px] font-pinyon mb-8 [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
        Summoning Yuno...
      </h2>
      
      <div className="w-[300px] h-1 bg-play-button/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-play-button shadow-[0_0_10px_#F9E4B7] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <span className="text-play-button font-cinzel text-lg mt-4 tracking-widest">
        {progress}%
      </span>
    </div>
  );
}