"use client";
import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; 
}

export function Typewriter({ text, speed = 25 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeNextChar, speed);
      }
    };
    typeNextChar();


    return () => clearTimeout(timeoutId);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}