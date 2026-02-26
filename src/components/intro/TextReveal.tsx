"use client";

import {
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
  type RefObject,
} from "react";
import { gsap } from "@/lib/gsap-config";
import { DURATIONS, EASINGS } from "@/lib/animation-constants";

interface TextRevealProps {
  text: string;
  progress: number;
  visible: boolean;
  containerRef?: RefObject<HTMLDivElement | null>;
}

export function TextReveal({
  text,
  progress,
  visible,
  containerRef: externalContainerRef,
}: TextRevealProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const textRef = externalContainerRef ?? internalRef;
  const charRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const flashRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const triggeredRef = useRef<Set<number>>(new Set());
  const positionsRef = useRef<{ centerX: number }[]>([]);

  const characters = useMemo(() => text.split(""), [text]);

  // Measure character positions on mount
  useLayoutEffect(() => {
    if (!visible) return;

    // Wait a frame for layout to stabilize
    const rafId = requestAnimationFrame(() => {
      positionsRef.current = characters.map((_, i) => {
        const el = charRefs.current.get(i);
        if (!el) return { centerX: 0 };
        const rect = el.getBoundingClientRect();
        return { centerX: rect.left + rect.width / 2 };
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, [visible, characters]);

  // Trigger letter walk animations based on scan progress
  useEffect(() => {
    if (!visible || progress <= 0) return;

    const screenWidth = window.innerWidth;

    characters.forEach((_, i) => {
      if (triggeredRef.current.has(i)) return;

      const threshold = (i + 1) / characters.length;
      if (progress < threshold * 0.85) return;

      triggeredRef.current.add(i);

      const charEl = charRefs.current.get(i);
      const flashEl = flashRefs.current.get(i);
      if (!charEl) return;

      const finalCenterX = positionsRef.current[i]?.centerX ?? 0;
      const scanX = progress * screenWidth;
      const offsetX = scanX - finalCenterX;

      // Start: at scan line position, invisible
      gsap.set(charEl, {
        x: offsetX,
        opacity: 1,
        visibility: "visible",
      });

      // Walk to final position with elastic bounce
      const tl = gsap.timeline();

      tl.to(charEl, {
        x: 0,
        duration: DURATIONS.letterWalk,
        ease: EASINGS.elastic,
      })
        // Squash on landing
        .to(
          charEl,
          {
            scaleX: 1.15,
            scaleY: 0.85,
            duration: 0.08,
            ease: "power2.in",
          },
          `-=${DURATIONS.letterWalk * 0.15}`
        )
        // Stretch recovery
        .to(charEl, {
          scaleX: 0.95,
          scaleY: 1.08,
          duration: 0.1,
          ease: "power2.out",
        })
        // Settle
        .to(charEl, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.15,
          ease: "power2.inOut",
        });

      // Micro-flash at base
      if (flashEl) {
        gsap.fromTo(
          flashEl,
          { opacity: 0.7, scaleX: 1.5 },
          {
            opacity: 0,
            scaleX: 0.3,
            duration: 0.25,
            delay: DURATIONS.letterWalk * 0.7,
            ease: "power2.out",
          }
        );
      }
    });
  }, [progress, visible, characters]);

  // Reset triggered set when becoming invisible
  useEffect(() => {
    if (!visible) {
      triggeredRef.current.clear();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={textRef}
      className="absolute inset-0 z-20 flex items-center justify-center"
      aria-live="polite"
    >
      <span
        className="font-sans text-5xl font-light tracking-[0.15em] text-white md:text-7xl lg:text-8xl"
        style={{ textShadow: "0 0 30px rgba(255,255,255,0.05)" }}
      >
        {characters.map((char, i) => (
          <span key={i} className="relative inline-block">
            <span
              ref={(el) => {
                if (el) charRefs.current.set(i, el);
                else charRefs.current.delete(i);
              }}
              className="inline-block"
              style={{
                opacity: 0,
                visibility: "hidden",
                transformOrigin: "center bottom",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
            {/* Micro-flash element at base */}
            <span
              ref={(el) => {
                if (el) flashRefs.current.set(i, el);
                else flashRefs.current.delete(i);
              }}
              className="absolute bottom-0 left-1/2 h-[1px] w-full -translate-x-1/2 bg-white opacity-0"
              aria-hidden="true"
            />
          </span>
        ))}
      </span>
    </div>
  );
}
