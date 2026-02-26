"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import {
  DOOR,
  LETTER,
  MICRO_DETAIL,
  POST_ANIM,
  COMPACT,
  EASINGS,
} from "@/lib/animation-constants";
import { DoorLine } from "./DoorLine";
import { LetterReveal } from "./LetterReveal";
import { ScanOverlay } from "./ScanOverlay";

interface IntroSequenceProps {
  onComplete: () => void;
  compact: boolean;
}

const INTRO_TEXT = "Acachete Labs";

export function IntroSequence({ onComplete, compact }: IntroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const seamGlowRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const scanRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const specRef = useRef<HTMLSpanElement>(null);
  const calibrationRef = useRef<HTMLSpanElement>(null);
  const offsetsRef = useRef<number[]>([]);
  const [measured, setMeasured] = useState(false);

  const characters = INTRO_TEXT.split("");

  // Measure letter positions before animation starts
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      const viewportWidth = window.innerWidth;
      const doorX = viewportWidth * 0.75;
      const offsets: number[] = [];

      characters.forEach((_, i) => {
        const el = charRefs.current.get(i);
        if (!el) {
          offsets.push(viewportWidth);
          return;
        }
        const rect = el.getBoundingClientRect();
        offsets.push(doorX - rect.left);
      });

      offsetsRef.current = offsets;
      setMeasured(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [characters]);

  useGSAP(
    () => {
      if (!measured) return;

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // === Phase 1: Door panel slides open, seam glow appears ===
      // Seam glow fades in first
      tl.to(seamGlowRef.current, {
        opacity: DOOR.seamGlowRest,
        duration: DOOR.expandDuration * 0.5,
        ease: EASINGS.cinematic,
      });

      // Panel slides right to create a small gap
      tl.to(
        panelRef.current,
        {
          x: compact ? DOOR.restDisplace - 1 : DOOR.restDisplace,
          duration: compact ? COMPACT.doorExpandDuration : DOOR.expandDuration,
          ease: EASINGS.smooth,
        },
        "<"
      );

      // === Phase 2: Letters emerge one by one ===
      const stagger = compact ? COMPACT.stagger : LETTER.stagger;
      const slideDuration = compact
        ? COMPACT.slideDuration
        : LETTER.slideDuration;

      characters.forEach((char, i) => {
        const charEl = charRefs.current.get(i);
        const scanEl = scanRefs.current.get(i);
        if (!charEl) return;

        const offset = offsetsRef.current[i] ?? window.innerWidth;
        const letterStart = `>${i === 0 ? "0" : stagger}`;

        // Skip space character animation (just reveal it)
        if (char === " ") {
          tl.set(charEl, { opacity: 1 }, letterStart);
          return;
        }

        if (!compact) {
          // Step 1: Position letter at door threshold, hidden via clipPath
          tl.set(
            charEl,
            {
              x: offset,
              opacity: 1,
              clipPath: "inset(0 0 100% 0)",
            },
            letterStart
          );

          // Step 2: Door opens wider — panel slides further right
          tl.to(
            panelRef.current,
            {
              x: DOOR.openDisplace,
              duration: 0.12,
              ease: EASINGS.cinematic,
            },
            "<"
          );
          tl.to(
            seamGlowRef.current,
            {
              opacity: DOOR.seamGlowOpen,
              duration: 0.12,
              ease: EASINGS.cinematic,
            },
            "<"
          );

          // Step 3: Vertical scan — line moves top to bottom + clipPath reveals letter
          if (scanEl) {
            tl.fromTo(
              scanEl,
              { top: "0%", opacity: 0.8 },
              {
                top: "100%",
                opacity: 0.2,
                duration: LETTER.scanDuration,
                ease: "power1.inOut",
              },
              "<+0.06"
            );
          }
          tl.to(
            charEl,
            {
              clipPath: "inset(0 0 0% 0)",
              duration: LETTER.scanDuration,
              ease: "power1.inOut",
            },
            "<"
          );

          // Step 4: Glow flash on letter (starts halfway through scan)
          tl.fromTo(
            charEl,
            { textShadow: "0 0 10px rgba(255,255,255,0.2)" },
            {
              textShadow: "0 0 0px rgba(255,255,255,0)",
              duration: LETTER.glowDuration,
              ease: EASINGS.exit,
            },
            `<+${LETTER.scanDuration * 0.5}`
          );

          // Step 5: Fade out scan line
          if (scanEl) {
            tl.to(
              scanEl,
              { opacity: 0, duration: 0.1, ease: EASINGS.exit },
              "<"
            );
          }

          // Step 6: Deliberate pause — letter is scanned, visible at threshold
          tl.to({}, { duration: LETTER.scanToSlideDelay });

          // Step 7: Letter slides to its final position
          tl.to(charEl, {
            x: 0,
            duration: slideDuration,
            ease: LETTER.slideEase,
          });

          // Step 8: Door closes back — panel returns to rest position
          tl.to(
            panelRef.current,
            {
              x: DOOR.restDisplace,
              duration: 0.18,
              ease: EASINGS.exit,
            },
            "<+0.08"
          );
          tl.to(
            seamGlowRef.current,
            {
              opacity: DOOR.seamGlowRest,
              duration: 0.18,
              ease: EASINGS.exit,
            },
            "<"
          );

          // Micro-detail overlays at specific letters
          if (i === 2 && specRef.current) {
            tl.fromTo(
              specRef.current,
              { opacity: 0 },
              {
                opacity: 1,
                duration: MICRO_DETAIL.fadeDuration,
                ease: EASINGS.cinematic,
              },
              "<-0.3"
            ).to(
              specRef.current,
              {
                opacity: 0,
                duration: MICRO_DETAIL.fadeDuration,
                ease: EASINGS.exit,
              },
              `>+${MICRO_DETAIL.displayDuration}`
            );
          }

          if (i === 9 && calibrationRef.current) {
            tl.fromTo(
              calibrationRef.current,
              { opacity: 0 },
              {
                opacity: 1,
                duration: MICRO_DETAIL.fadeDuration,
                ease: EASINGS.cinematic,
              },
              "<-0.3"
            ).to(
              calibrationRef.current,
              {
                opacity: 0,
                duration: MICRO_DETAIL.fadeDuration,
                ease: EASINGS.exit,
              },
              `>+${MICRO_DETAIL.displayDuration}`
            );
          }
        } else {
          // Compact mode: simple slide, no scan, no door pulse
          tl.set(charEl, { x: offset, opacity: 1 }, letterStart);
          tl.to(charEl, {
            x: 0,
            duration: slideDuration,
            ease: LETTER.slideEase,
          });
        }
      });

      // === Phase 3: Hold (silence) — full mode only ===
      if (!compact) {
        tl.to({}, { duration: POST_ANIM.holdDuration });
      }

      // === Phase 4: Door closes fully + container fades out ===
      if (!compact) {
        // Panel slides back to closed position
        tl.to(
          panelRef.current,
          {
            x: 0,
            duration: 0.5,
            ease: EASINGS.smooth,
          },
          ">-0.1"
        );
        // Seam glow fades
        tl.to(
          seamGlowRef.current,
          {
            opacity: 0,
            duration: 0.4,
            ease: EASINGS.exit,
          },
          "<"
        );
      }

      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: compact ? COMPACT.fadeDuration : 0.5,
          ease: EASINGS.exit,
        },
        compact ? ">" : ">-0.3"
      );
    },
    { scope: containerRef, dependencies: [measured, compact] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50"
      style={{ backgroundColor: "#0B0B0B" }}
      role="status"
      aria-label="Loading laboratory"
    >
      <DoorLine panelRef={panelRef} seamGlowRef={seamGlowRef} />

      <LetterReveal
        text={INTRO_TEXT}
        charRefs={charRefs}
        scanRefs={scanRefs}
      />

      {!compact && (
        <ScanOverlay specRef={specRef} calibrationRef={calibrationRef} />
      )}
    </div>
  );
}
