"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { DURATIONS, EASINGS } from "@/lib/animation-constants";
import { ScanningCanvas } from "./ScanningCanvas";
import { TextReveal } from "./TextReveal";
import { ParticleDisintegration } from "./ParticleDisintegration";

interface IntroSequenceProps {
  onComplete: () => void;
}

const INTRO_TEXT = "Acachete Labs";

type Phase = "idle" | "scanning" | "hold" | "fragmenting" | "done";

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

      // Phase 1: Scanning line + text reveal
      tl.call(() => setPhase("scanning"))
        .to(progressRef.current, {
          scan: 1,
          duration: DURATIONS.scanLine,
          ease: EASINGS.smooth,
          onUpdate: () => setScanProgress(progressRef.current.scan),
        })

        // Phase 2: Hold
        .call(() => setPhase("hold"))
        .to({}, { duration: DURATIONS.hold })

        // Phase 3: Fragment
        .call(() => setPhase("fragmenting"))
        .to(progressRef.current, {
          fragment: 1,
          duration: DURATIONS.fragment,
          ease: EASINGS.enter,
          onUpdate: () => setFragmentProgress(progressRef.current.fragment),
        })

        // Phase 4: Fade out container
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: EASINGS.exit,
          },
          `-=0.4`
        );
    },
    { scope: containerRef }
  );

  const showScan = phase === "scanning";
  const showText = phase === "scanning" || phase === "hold";
  const showParticles = phase === "fragmenting";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      role="status"
      aria-label="Loading laboratory"
    >
      {showScan && <ScanningCanvas progress={scanProgress} />}

      <TextReveal
        text={INTRO_TEXT}
        progress={scanProgress}
        visible={showText}
      />

      <ParticleDisintegration
        active={showParticles}
        progress={fragmentProgress}
        text={INTRO_TEXT}
      />
    </div>
  );
}
