"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

export function BlueprintGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = containerRef.current?.querySelectorAll(".bp-line");
      if (!lines) return;

      gsap.fromTo(
        lines,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 2,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    },
    { scope: containerRef }
  );

  const horizontalLines = [20, 40, 60, 80];
  const verticalLines = [25, 50, 75];

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {horizontalLines.map((pos) => (
        <div
          key={`h-${pos}`}
          className="bp-line absolute left-0 h-px w-full bg-line opacity-0"
          style={{ top: `${pos}%` }}
        />
      ))}
      {verticalLines.map((pos) => (
        <div
          key={`v-${pos}`}
          className="bp-line absolute top-0 h-full w-px bg-line opacity-0"
          style={{ left: `${pos}%` }}
        />
      ))}
    </div>
  );
}
