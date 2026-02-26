"use client";

import { useMemo, useCallback } from "react";

interface LetterRevealProps {
  text: string;
  charRefs: React.MutableRefObject<Map<number, HTMLSpanElement>>;
  scanRefs: React.MutableRefObject<Map<number, HTMLSpanElement>>;
}

export function LetterReveal({ text, charRefs, scanRefs }: LetterRevealProps) {
  const characters = useMemo(() => text.split(""), [text]);

  const setCharRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      if (el) charRefs.current.set(i, el);
      else charRefs.current.delete(i);
    },
    [charRefs]
  );

  const setScanRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      if (el) scanRefs.current.set(i, el);
      else scanRefs.current.delete(i);
    },
    [scanRefs]
  );

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center px-8"
      aria-live="polite"
    >
      <span
        className="flex flex-wrap justify-center font-sans"
        style={{ maxWidth: "calc(100vw - 4rem)" }}
      >
        {characters.map((char, i) => (
          <span key={i} className="relative inline-block overflow-visible">
            <span
              ref={setCharRef(i)}
              className="inline-block"
              style={{
                opacity: 0,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
            {/* Vertical scan line — horizontal bar that moves top to bottom */}
            <span
              ref={setScanRef(i)}
              className="pointer-events-none absolute left-0 h-[1px] w-full bg-white"
              style={{
                opacity: 0,
                top: "0%",
                boxShadow: "0 0 8px 2px rgba(255,255,255,0.3)",
              }}
              aria-hidden="true"
            />
          </span>
        ))}
      </span>
    </div>
  );
}
