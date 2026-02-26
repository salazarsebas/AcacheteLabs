"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { DURATIONS } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MicroLabelProps {
  text: string;
  className?: string;
  staggerIndex?: number;
}

export function MicroLabel({
  text,
  className = "",
  staggerIndex = 0,
}: MicroLabelProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !spanRef.current) return;

      gsap.fromTo(
        spanRef.current,
        { opacity: 0 },
        {
          opacity: 0.1,
          duration: 1.0,
          delay: staggerIndex * DURATIONS.microLabelStagger,
          ease: "power2.out",
        }
      );
    },
    { scope: spanRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <span
      ref={spanRef}
      className={`pointer-events-none absolute font-mono text-[7px] uppercase tracking-[0.3em] text-white/[0.10] ${className}`}
      style={prefersReducedMotion ? undefined : { opacity: 0 }}
    >
      {text}
    </span>
  );
}
