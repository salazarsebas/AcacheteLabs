"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { DURATIONS } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CADMarkerProps {
  className?: string;
}

export function CADMarker({ className = "" }: CADMarkerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !svgRef.current) return;

      gsap.to(svgRef.current, {
        rotation: 360,
        duration: DURATIONS.cadRotation,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    },
    { scope: svgRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <svg
      ref={svgRef}
      className={`pointer-events-none absolute text-white/[0.08] ${className}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <line
        x1="8"
        y1="0"
        x2="8"
        y2="16"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="8"
        x2="16"
        y2="8"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}
