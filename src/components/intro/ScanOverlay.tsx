"use client";

import type { RefObject } from "react";

interface ScanOverlayProps {
  specRef: RefObject<HTMLSpanElement | null>;
  calibrationRef: RefObject<HTMLSpanElement | null>;
}

export function ScanOverlay({ specRef, calibrationRef }: ScanOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden="true"
    >
      <span
        ref={specRef}
        className="absolute font-mono text-[9px] uppercase tracking-[0.15em]"
        style={{
          color: "rgba(255, 255, 255, 0.25)",
          opacity: 0,
          top: "calc(50% - 3.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Spec: 01
      </span>
      <span
        ref={calibrationRef}
        className="absolute font-mono text-[9px] uppercase tracking-[0.15em]"
        style={{
          color: "rgba(255, 255, 255, 0.25)",
          opacity: 0,
          top: "calc(50% - 3.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Calibration: Stable
      </span>
    </div>
  );
}
