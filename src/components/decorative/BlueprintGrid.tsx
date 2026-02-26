"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { GRID, DURATIONS } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const horizontalPositions = [20, 40, 60, 80];
const verticalPositions = [25, 50, 75];

export function BlueprintGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const prefersReducedMotion = useReducedMotion();
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);

  const setLineRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      if (el) lineRefs.current[index] = el;
    },
    []
  );

  // GSAP entrance animation
  useGSAP(
    () => {
      const lines = containerRef.current?.querySelectorAll(".bp-line");
      if (!lines) return;

      gsap.fromTo(
        lines,
        { opacity: 0 },
        {
          opacity: GRID.baseOpacity,
          duration: 2,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    },
    { scope: containerRef }
  );

  // Mouse tracking + proximity glow + breathing pulse
  useEffect(() => {
    if (prefersReducedMotion) return;

    startTimeRef.current = performance.now();

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }

    function animate() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = (performance.now() - startTimeRef.current) * 0.001;

      // Slow breathing pulse
      const pulse =
        Math.sin(t * ((2 * Math.PI) / DURATIONS.gridPulse)) *
        GRID.pulseAmplitude;

      for (let i = 0; i < lineRefs.current.length; i++) {
        const line = lineRefs.current[i];
        if (!line) continue;

        const isHorizontal = line.dataset.orientation === "h";
        const pos = parseFloat(line.dataset.pos || "0") / 100;

        // Distance from mouse to this line
        const dist = isHorizontal
          ? Math.abs(my - pos * h)
          : Math.abs(mx - pos * w);

        // Proximity: 1 at mouse, 0 at radius edge
        const proximity = Math.max(0, 1 - dist / GRID.proximityRadius);
        const targetOpacity =
          GRID.baseOpacity +
          pulse +
          proximity * (GRID.activeOpacity - GRID.baseOpacity);

        line.style.opacity = String(
          Math.max(0, Math.min(1, targetOpacity))
        );

        if (proximity > 0.1) {
          const glowStrength = proximity * 8;
          line.style.boxShadow = `0 0 ${glowStrength}px rgba(255,255,255,${proximity * 0.12})`;
        } else {
          line.style.boxShadow = "none";
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  let lineIndex = 0;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {horizontalPositions.map((pos) => {
        const idx = lineIndex++;
        return (
          <div
            key={`h-${pos}`}
            ref={(el) => setLineRef(el, idx)}
            data-orientation="h"
            data-pos={pos}
            className="bp-line absolute left-0 h-px w-full bg-line opacity-0"
            style={{ top: `${pos}%` }}
          />
        );
      })}
      {verticalPositions.map((pos) => {
        const idx = lineIndex++;
        return (
          <div
            key={`v-${pos}`}
            ref={(el) => setLineRef(el, idx)}
            data-orientation="v"
            data-pos={pos}
            className="bp-line absolute top-0 h-full w-px bg-line opacity-0"
            style={{ left: `${pos}%` }}
          />
        );
      })}
    </div>
  );
}
