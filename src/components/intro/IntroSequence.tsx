"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { DURATIONS, EASINGS } from "@/lib/animation-constants";
import { ScanningCanvas } from "./ScanningCanvas";
import { TextReveal } from "./TextReveal";
import { ParticleDisintegration } from "./ParticleDisintegration";
import { CanvasErrorBoundary } from "@/components/ui/CanvasErrorBoundary";

interface IntroSequenceProps {
  onComplete: () => void;
}

const INTRO_TEXT = "Acachete Labs";

type Phase =
  | "idle"
  | "scanning"
  | "settling"
  | "hold"
  | "fragmenting"
  | "done";

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fragmentProgress, setFragmentProgress] = useState(0);
  const progressRef = useRef({ scan: 0, fragment: 0 });

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase("done");
          onComplete();
        },
      });

      // Phase 1: Scanning + letter walking
      tl.call(() => setPhase("scanning"))
        .to(progressRef.current, {
          scan: 1,
          duration: DURATIONS.scanLine,
          ease: EASINGS.smooth,
          onUpdate: () => setScanProgress(progressRef.current.scan),
        })

        // Phase 2: Let last letters settle
        .call(() => setPhase("settling"))
        .to({}, { duration: 0.4 })

        // Phase 3: Hold with breathing
        .call(() => setPhase("hold"));

      // Breathing animation on text container
      if (textContainerRef.current) {
        tl.to(textContainerRef.current, {
          scale: 1.005,
          duration: DURATIONS.holdBreathing / 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        });
      } else {
        tl.to({}, { duration: DURATIONS.hold });
      }

      // Phase 4: Fragment
      tl.call(() => setPhase("fragmenting"))
        .to(progressRef.current, {
          fragment: 1,
          duration: DURATIONS.fragment,
          ease: EASINGS.enter,
          onUpdate: () =>
            setFragmentProgress(progressRef.current.fragment),
        })

        // Phase 5: Fade out container
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: EASINGS.exit,
          },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  const showScan = phase === "scanning";
  const showText =
    phase === "scanning" || phase === "settling" || phase === "hold";
  const showParticles = phase === "fragmenting";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      role="status"
      aria-label="Loading laboratory"
    >
      <CanvasErrorBoundary>
        <ScanningCanvas progress={scanProgress} active={showScan} />
      </CanvasErrorBoundary>

      <TextReveal
        text={INTRO_TEXT}
        progress={scanProgress}
        visible={showText}
        containerRef={textContainerRef}
      />

      <CanvasErrorBoundary>
        <ParticleDisintegration
          active={showParticles}
          progress={fragmentProgress}
          text={INTRO_TEXT}
        />
      </CanvasErrorBoundary>
    </div>
  );
}
