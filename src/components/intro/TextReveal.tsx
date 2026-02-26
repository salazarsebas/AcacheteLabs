"use client";

import { useRef, useMemo } from "react";

interface TextRevealProps {
  text: string;
  progress: number; // 0 to 1
  visible: boolean;
}

export function TextReveal({ text, progress, visible }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const characters = useMemo(() => text.split(""), [text]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 flex items-center justify-center"
      aria-live="polite"
    >
      <span
        className="font-sans text-5xl font-light tracking-[0.15em] text-white md:text-7xl lg:text-8xl"
        style={{ textShadow: "0 0 30px rgba(255,255,255,0.05)" }}
      >
        {characters.map((char, i) => {
          const charProgress = (i + 1) / characters.length;
          const isVisible = progress >= charProgress * 0.9;

          return (
            <span
              key={i}
              className="inline-block transition-opacity duration-100"
              style={{
                opacity: isVisible ? 1 : 0,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    </div>
  );
}
