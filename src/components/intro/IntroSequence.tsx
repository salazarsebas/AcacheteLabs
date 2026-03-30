"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import {
  COMPACT,
  EASINGS,
  INTRO_PREMIUM,
  POST_ANIM,
} from "@/lib/animation-constants";

interface IntroSequenceProps {
  onComplete: () => void;
  compact: boolean;
}

const MOBILE_BREAKPOINT = "(max-width: 640px)";

export function IntroSequence({ onComplete, compact }: IntroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const auraLeftRef = useRef<HTMLDivElement>(null);
  const auraRightRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const syncStacked = () => setStacked(mediaQuery.matches);

    syncStacked();
    mediaQuery.addEventListener("change", syncStacked);

    return () => mediaQuery.removeEventListener("change", syncStacked);
  }, []);

  const lines = stacked ? ["Acachete", "Labs"] : ["Acachete Labs"];

  useGSAP(
    () => {
      const lineElements = lineRefs.current.slice(0, lines.length).filter(Boolean);
      if (
        !containerRef.current ||
        !sceneRef.current ||
        !bloomRef.current ||
        !auraLeftRef.current ||
        !auraRightRef.current ||
        !irisRef.current ||
        !wordmarkRef.current ||
        !highlightRef.current ||
        !beamRef.current ||
        lineElements.length === 0
      ) {
        return;
      }

      const speed = compact ? INTRO_PREMIUM.compactMultiplier : 1;
      const holdDuration = compact ? 0.16 : POST_ANIM.holdDuration;
      const lineSpacingStart = stacked ? "0.18em" : "0.22em";
      const lineSpacingEnd = stacked ? "0.12em" : "0.14em";
      const exitDuration = compact
        ? COMPACT.fadeDuration + 0.08
        : INTRO_PREMIUM.exitDuration;

      gsap.set(containerRef.current, {
        opacity: 1,
        background:
          "radial-gradient(circle at 50% 34%, rgba(255,242,220,0.06), rgba(8,8,8,0.95) 48%, #020202 100%)",
      });
      gsap.set(sceneRef.current, {
        opacity: compact ? 0.94 : 0.8,
        scale: compact ? 1.01 : 1.04,
      });
      gsap.set([bloomRef.current, auraLeftRef.current, auraRightRef.current], {
        opacity: 0,
        scale: 0.9,
      });
      gsap.set(irisRef.current, {
        opacity: 0,
        clipPath: "circle(10% at 50% 50%)",
      });
      gsap.set(wordmarkRef.current, {
        opacity: 1,
      });
      gsap.set(lineElements, {
        opacity: 0,
        y: 26,
        scale: 0.985,
        letterSpacing: lineSpacingStart,
        transformOrigin: "50% 60%",
      });
      gsap.set(highlightRef.current, {
        opacity: 0,
        scale: 0.88,
      });
      gsap.set(beamRef.current, {
        opacity: 0,
        xPercent: -90,
        rotate: -10,
      });

      const tl = gsap.timeline({
        defaults: { ease: EASINGS.cinematic },
        onComplete,
      });

      tl.to(sceneRef.current, {
        opacity: 1,
        scale: 1,
        duration: INTRO_PREMIUM.atmosphereDuration * speed,
      });

      tl.to(
        irisRef.current,
        {
          opacity: 1,
          clipPath: "circle(88% at 50% 50%)",
          duration: INTRO_PREMIUM.apertureDuration * speed,
          ease: "power4.out",
        },
        0.08
      );

      tl.to(
        bloomRef.current,
        {
          opacity: compact ? 0.36 : 0.62,
          scale: 1.06,
          duration: 1.1 * speed,
          ease: "power3.out",
        },
        0.16
      );

      tl.to(
        [auraLeftRef.current, auraRightRef.current],
        {
          opacity: compact ? 0.14 : 0.26,
          scale: 1.04,
          duration: 1.15 * speed,
          stagger: 0.06,
          ease: "sine.out",
        },
        0.2
      );

      tl.to(
        lineElements,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          letterSpacing: lineSpacingEnd,
          duration: INTRO_PREMIUM.wordmarkRiseDuration * speed,
          stagger: INTRO_PREMIUM.lineStagger * speed,
          ease: "power3.out",
        },
        0.34
      );

      tl.to(
        highlightRef.current,
        {
          opacity: compact ? 0.22 : 0.38,
          scale: 1,
          duration: 0.42,
          ease: "power2.out",
        },
        0.58
      );

      tl.to(
        beamRef.current,
        {
          opacity: compact ? 0.3 : 0.48,
          xPercent: 96,
          duration: compact ? 0.62 : 0.9,
          ease: "power2.inOut",
        },
        0.76
      );

      tl.to(
        beamRef.current,
        {
          opacity: 0,
          duration: 0.22,
          ease: EASINGS.exit,
        },
        "-=0.12"
      );

      tl.to(
        highlightRef.current,
        {
          opacity: compact ? 0.14 : 0.24,
          duration: 0.24,
          ease: EASINGS.exit,
        },
        "<"
      );

      tl.to({}, { duration: holdDuration });

      tl.to(
        wordmarkRef.current,
        {
          opacity: 0,
          y: compact ? -8 : -16,
          scale: 0.985,
          duration: exitDuration,
          ease: "power2.inOut",
        },
        ">"
      );

      tl.to(
        [highlightRef.current, bloomRef.current, auraLeftRef.current, auraRightRef.current],
        {
          opacity: 0,
          scale: 1.08,
          duration: exitDuration,
          ease: EASINGS.exit,
        },
        "<"
      );

      tl.to(
        sceneRef.current,
        {
          opacity: 0,
          scale: 1.03,
          duration: exitDuration,
          ease: EASINGS.exit,
        },
        "<"
      );

      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: compact ? COMPACT.fadeDuration : 0.42,
          ease: EASINGS.exit,
        },
        "-=0.12"
      );
    },
    { scope: containerRef, dependencies: [compact, stacked] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden"
      role="status"
      aria-label="Loading Acachete Labs"
    >
      <div className="absolute inset-0 bg-[#020202]" aria-hidden="true" />

      <div
        ref={sceneRef}
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255, 238, 208, 0.08), transparent 26%), radial-gradient(circle at 50% 52%, rgba(184, 218, 255, 0.06), transparent 40%), linear-gradient(180deg, rgba(10,10,10,0.16), rgba(2,2,2,0.97) 76%)",
        }}
      />

      <div
        ref={bloomRef}
        className="absolute left-1/2 top-1/2 h-[46vw] w-[46vw] min-h-[18rem] min-w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(255,244,224,0.24) 0%, rgba(240,200,141,0.14) 24%, rgba(130,180,255,0.08) 46%, rgba(0,0,0,0) 72%)",
          filter: "blur(28px)",
        }}
      />

      <div
        ref={auraLeftRef}
        className="absolute left-[2vw] top-[18vh] h-[22vw] w-[22vw] min-h-[10rem] min-w-[10rem] rounded-full"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(193,226,255,0.12) 0%, rgba(193,226,255,0.02) 64%, rgba(0,0,0,0) 78%)",
          filter: "blur(16px)",
        }}
      />

      <div
        ref={auraRightRef}
        className="absolute bottom-[14vh] right-[3vw] h-[20vw] w-[20vw] min-h-[9rem] min-w-[9rem] rounded-full"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(255,223,176,0.1) 0%, rgba(255,223,176,0.02) 60%, rgba(0,0,0,0) 78%)",
          filter: "blur(16px)",
        }}
      />

      <div
        ref={irisRef}
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.035), rgba(255,255,255,0) 34%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.18))",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-12">
        <div className="relative flex w-full max-w-[78rem] items-center justify-center">
          <div
            ref={wordmarkRef}
            className="relative max-w-full overflow-visible px-4 py-8 text-center sm:px-8"
          >
            <div
              ref={highlightRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-[999px]"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,244,224,0.18) 0%, rgba(255,244,224,0.06) 42%, rgba(0,0,0,0) 74%)",
                filter: "blur(22px)",
              }}
            />

            <div
              ref={beamRef}
              className="pointer-events-none absolute inset-y-[-12%] left-[-20%] w-[20%]"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,246,227,0.85) 48%, rgba(255,255,255,0) 100%)",
                filter: "blur(10px)",
                mixBlendMode: "screen",
              }}
            />

            <div
              className={`intro-premium-wordmark flex flex-col items-center ${
                stacked ? "gap-2 sm:gap-3" : "gap-0"
              }`}
            >
              {lines.map((line, index) => (
                <span
                  key={line}
                  ref={(node) => {
                    lineRefs.current[index] = node;
                  }}
                  className="intro-premium-line block whitespace-nowrap"
                  style={{
                    fontSize: stacked
                      ? index === 0
                        ? "clamp(3.05rem, 13vw, 5.7rem)"
                        : "clamp(2.65rem, 10.4vw, 4.8rem)"
                      : "clamp(3.35rem, 8.8vw, 7.4rem)",
                    color: "rgba(252, 247, 240, 0.98)",
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.08), 0 12px 38px rgba(0,0,0,0.46)",
                  }}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0.08) 76%, rgba(0,0,0,0.84) 100%)",
        }}
      />
    </div>
  );
}
