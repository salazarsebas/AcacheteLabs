"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { DURATIONS } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CornerIndicatorProps {
  label: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const positionClasses: Record<CornerIndicatorProps["position"], string> = {
  "top-left": "top-14 left-6 md:left-10",
  "top-right": "top-14 right-6 md:right-10",
  "bottom-left": "bottom-6 left-6 md:left-10",
  "bottom-right": "bottom-6 right-6 md:right-10",
};

export function CornerIndicator({ label, position }: CornerIndicatorProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !spanRef.current) return;

      gsap.to(spanRef.current, {
        opacity: 0.08,
        duration: DURATIONS.cornerBlink / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: spanRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <span
      ref={spanRef}
      className={`pointer-events-none fixed z-30 font-mono text-[9px] tracking-wider text-text-muted ${positionClasses[position]}`}
    >
      {label}
    </span>
  );
}
