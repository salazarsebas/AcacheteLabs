"use client";

import type { RefObject } from "react";

interface DoorLineProps {
  panelRef: RefObject<HTMLDivElement | null>;
  seamGlowRef: RefObject<HTMLDivElement | null>;
}

export function DoorLine({ panelRef, seamGlowRef }: DoorLineProps) {
  return (
    <>
      {/* The seam glow — fixed at the door position, revealed when panel slides */}
      <div
        ref={seamGlowRef}
        className="fixed top-0 z-30 h-screen"
        style={{
          left: "75vw",
          width: "2px",
          transform: "translateX(-50%)",
          opacity: 0,
          background: "rgba(255,255,255,0.7)",
          boxShadow:
            "0 0 30px 8px rgba(255,255,255,0.06), 0 0 80px 20px rgba(255,255,255,0.03)",
        }}
        aria-hidden="true"
      />

      {/* The door panel — covers right 25% of viewport, slides right to open */}
      <div
        ref={panelRef}
        className="fixed top-0 z-30 h-screen"
        style={{
          left: "75vw",
          width: "25vw",
          backgroundColor: "#0B0B0B",
          transform: "translateX(0px)",
        }}
        aria-hidden="true"
      >
        {/* Panel left edge — the seam line, always visible */}
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: "1px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 15%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 85%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    </>
  );
}
