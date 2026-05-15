"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

interface IntroSequenceProps {
  onComplete: () => void;
}

interface CharMeta {
  key: string;
  char: string;
}

const MOBILE_BREAKPOINT = "(max-width: 640px)";

const TIMINGS = {
  atmosphere: 1.4,
  aperture: 1.6,
  horizon: 1,
  charReveal: 0.92,
  charStagger: 0.07,
  glint: 0.78,
  hold: 2.2,
  exit: 0.88,
} as const;

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [stacked, setStacked] = useState(false);

  // Lock scroll for the duration of the intro
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const syncStacked = () => setStacked(mediaQuery.matches);

    syncStacked();
    mediaQuery.addEventListener("change", syncStacked);

    return () => mediaQuery.removeEventListener("change", syncStacked);
  }, []);

  const lines = stacked ? ["Acachete", "Labs"] : ["Acachete Labs"];
  const lineChars: CharMeta[][] = lines.map((line, lineIndex) =>
    line.split("").map((char, charIndex) => ({
      key: `${lineIndex}-${charIndex}`,
      char,
    }))
  );

  useGSAP(
    () => {
      const characters = lineChars
        .flat()
        .map(({ key, char }) => ({
          char,
          element: charRefs.current.get(key) ?? null,
        }))
        .filter(
          (entry): entry is { char: string; element: HTMLSpanElement } =>
            entry.char !== " " && entry.element !== null
        );

      if (
        !containerRef.current ||
        !sceneRef.current ||
        !veilRef.current ||
        !haloRef.current ||
        !apertureRef.current ||
        !horizonRef.current ||
        !wordmarkRef.current ||
        !sheenRef.current ||
        !progressRef.current ||
        characters.length === 0
      ) {
        return;
      }

      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(sceneRef.current, { opacity: 0, scale: 1.04 });
      gsap.set(veilRef.current, { opacity: 0 });
      gsap.set(haloRef.current, { opacity: 0, scale: 0.88 });
      gsap.set(apertureRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(horizonRef.current, {
        opacity: 0,
        scaleX: 0.32,
        transformOrigin: "50% 50%",
      });
      gsap.set(wordmarkRef.current, { opacity: 1, y: 18, scale: 1.025 });
      gsap.set(sheenRef.current, { opacity: 0, xPercent: -120 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "0% 50%" });

      const totalCharacters = characters.length;
      characters.forEach((entry, index) => {
        const progress = totalCharacters === 1 ? 0.5 : index / (totalCharacters - 1);
        const centerBias = Math.abs(progress - 0.5);

        gsap.set(entry.element, {
          opacity: 0,
          y: 70 - centerBias * 14,
          z: -120 + centerBias * 36,
          rotateX: -64,
          rotateY: (progress - 0.5) * 12,
          scale: 0.84,
          filter: "blur(8px)",
          transformOrigin: "50% 100%",
          force3D: true,
        });
      });

      // Build timeline paused so we can read its duration for the progress bar
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete,
        paused: true,
      });

      timeline.to(sceneRef.current, {
        opacity: 1,
        scale: 1,
        duration: TIMINGS.atmosphere,
      });

      timeline.to(
        veilRef.current,
        { opacity: 1, duration: TIMINGS.atmosphere },
        0.08
      );

      timeline.to(
        haloRef.current,
        { opacity: 0.82, scale: 1, duration: TIMINGS.atmosphere, ease: "power2.out" },
        0.2
      );

      timeline.to(
        apertureRef.current,
        { opacity: 0.7, scale: 1, duration: TIMINGS.aperture, ease: "power2.out" },
        0.34
      );

      timeline.to(
        horizonRef.current,
        { opacity: 0.8, scaleX: 1, duration: TIMINGS.horizon, ease: "power2.out" },
        0.54
      );

      timeline.to(
        wordmarkRef.current,
        { y: 0, scale: 1, duration: 1.1 },
        0.9
      );

      characters.forEach((entry, index) => {
        timeline.to(
          entry.element,
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: TIMINGS.charReveal,
            ease: "power4.out",
          },
          1.12 + index * TIMINGS.charStagger
        );
      });

      timeline.to(
        sheenRef.current,
        { opacity: 0.9, xPercent: 120, duration: TIMINGS.glint, ease: "power2.inOut" },
        2.58
      );

      timeline.to(
        sheenRef.current,
        { opacity: 0, duration: 0.2, ease: "power1.out" },
        3.08
      );

      timeline.to({}, { duration: TIMINGS.hold });

      // exit: each element has its own personality
      timeline.to(
        horizonRef.current,
        { opacity: 0, scaleX: 0, duration: TIMINGS.exit * 0.88, ease: "power3.inOut", transformOrigin: "50% 50%" },
        ">"
      );

      timeline.to(
        apertureRef.current,
        { opacity: 0, scale: 0.84, duration: TIMINGS.exit * 0.88, ease: "power2.inOut" },
        "<"
      );

      timeline.to(
        veilRef.current,
        { opacity: 0, duration: TIMINGS.exit * 0.88, ease: "power2.inOut" },
        "<"
      );

      // halo bleeds out: expands as it fades
      timeline.to(
        haloRef.current,
        { opacity: 0, scale: 1.18, duration: TIMINGS.exit * 1.1, ease: "power1.out" },
        "<"
      );

      // wordmark: camera pull-back with rack-focus blur
      timeline.to(
        wordmarkRef.current,
        { opacity: 0, scale: 0.91, filter: "blur(6px)", duration: TIMINGS.exit * 1.1, ease: "power3.inOut" },
        "<"
      );

      // scene: recedes with the wordmark
      timeline.to(
        sceneRef.current,
        { opacity: 0, scale: 0.96, duration: TIMINGS.exit * 1.1, ease: "power2.inOut" },
        "<"
      );

      timeline.to(
        containerRef.current,
        { opacity: 0, duration: 0.28, ease: "power1.out" },
        "-=0.14"
      );

      // Capture total duration once before adding meta tweens
      const totalDur = timeline.duration();

      // Progress bar: linear fill left-to-right
      timeline.to(
        progressRef.current,
        { scaleX: 1, ease: "none", duration: totalDur },
        0
      );

      // Countdown: proxy object counts down from totalDur → 0
      const proxy = { val: totalDur };
      if (countdownRef.current) {
        countdownRef.current.textContent = `${Math.ceil(totalDur)}s`;
      }
      timeline.to(proxy, {
        val: 0,
        ease: "none",
        duration: totalDur,
        onUpdate: () => {
          if (countdownRef.current) {
            const remaining = Math.ceil(proxy.val);
            countdownRef.current.textContent = remaining > 0 ? `${remaining}s` : "";
          }
        },
      }, 0);

      timeline.play();
    },
    { scope: containerRef, dependencies: [stacked] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[#040404]"
      role="status"
      aria-label="Loading Acachete Labs"
    >
      <div ref={sceneRef} className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#040404]" />

        <div
          ref={veilRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 44%, rgba(255,246,230,0.08) 0%, rgba(73,86,108,0.06) 26%, rgba(4,4,5,0) 62%)",
          }}
        />

        <div
          ref={haloRef}
          className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] max-h-[95vw] max-w-[95vw] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(255,239,214,0.16) 0%, rgba(166,195,230,0.08) 38%, rgba(0,0,0,0) 74%)",
            filter: "blur(30px)",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
          <div
            ref={apertureRef}
            className="h-[min(68vw,31rem)] w-[min(68vw,31rem)] rounded-full border border-white/10 sm:h-[min(52vw,34rem)] sm:w-[min(52vw,34rem)]"
            style={{
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 34px rgba(235,212,174,0.08)",
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
          <div
            ref={wordmarkRef}
            className="relative max-w-full px-2 text-center [perspective:1600px]"
          >
            <div
              ref={sheenRef}
              className="pointer-events-none absolute inset-y-[-18%] left-[-14%] w-[14%]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,249,238,0.92) 50%, rgba(255,255,255,0) 100%)",
                filter: "blur(10px)",
                mixBlendMode: "screen",
              }}
            />

            <div
              className={`intro-cinematic-wordmark flex flex-col items-center ${
                stacked ? "gap-1" : "gap-0"
              }`}
            >
              {lineChars.map((chars, lineIndex) => (
                <div
                  key={`line-${lineIndex}`}
                  className="flex flex-wrap justify-center whitespace-nowrap"
                >
                  {chars.map(({ key, char }) => (
                    <span
                      key={key}
                      ref={(node) => {
                        if (node) charRefs.current.set(key, node);
                        else charRefs.current.delete(key);
                      }}
                      className={`intro-cinematic-char ${
                        char === " " ? "w-[0.36em]" : ""
                      }`}
                      style={{
                        fontSize: stacked
                          ? lineIndex === 0
                            ? "clamp(3.45rem, 14vw, 6.2rem)"
                            : "clamp(3rem, 11.2vw, 5.15rem)"
                          : "clamp(4rem, 9vw, 8.1rem)",
                        marginRight: char === " " ? "0.055em" : "0.01em",
                      }}
                    >
                      {char === " " ? " " : char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
          <div
            ref={horizonRef}
            className="h-px w-[min(70rem,82vw)]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,236,204,0.24) 18%, rgba(194,220,248,0.38) 50%, rgba(255,236,204,0.24) 82%, rgba(255,255,255,0) 100%)",
              boxShadow:
                "0 0 18px rgba(186,219,255,0.16), 0 0 30px rgba(255,223,173,0.08)",
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 52%, rgba(0,0,0,0.86) 100%)",
          }}
        />
      </div>

      {/* Bottom HUD: countdown + progress bar */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <div className="flex justify-end px-6 pb-2.5 md:px-10">
          <span
            ref={countdownRef}
            className="font-mono tabular-nums"
            style={{ fontSize: "22px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}
          />
        </div>
        <div
          ref={progressRef}
          className="h-px w-full"
          style={{
            background: "rgba(255,255,255,0.2)",
            transformOrigin: "0% 50%",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}
