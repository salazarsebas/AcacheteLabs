"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

interface HeroSectionProps {
  visible: boolean;
}

export function HeroSection({ visible }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !labelRef.current ||
        !line1Ref.current ||
        !line2Ref.current ||
        !subtextRef.current ||
        !scrollHintRef.current ||
        !rulerRef.current
      )
        return;

      const tl = gsap.timeline({ paused: !visible });

      gsap.set(
        [labelRef.current, line1Ref.current, line2Ref.current, subtextRef.current, scrollHintRef.current, rulerRef.current],
        { opacity: 0, y: 16 }
      );
      gsap.set(rulerRef.current, { scaleX: 0, y: 0, transformOrigin: "0% 50%" });

      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
        .to(rulerRef.current, { opacity: 1, scaleX: 1, duration: 0.8, ease: "power3.out" }, 0.1)
        .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.18)
        .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.28)
        .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.46)
        .to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.62);

      if (visible) tl.play();
    },
    { scope: containerRef, dependencies: [visible] }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col justify-center px-6 md:px-16 lg:px-24"
      aria-label="Acachete Labs: Software Laboratory"
    >
      <div className="max-w-[900px]">
        <span
          ref={labelRef}
          className="mb-8 block font-mono text-[10px] uppercase tracking-[0.35em] text-text-muted"
        >
          Software Laboratory
        </span>

        <div
          ref={rulerRef}
          className="mb-10 h-px w-16"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.04) 100%)",
          }}
          aria-hidden="true"
        />

        <div ref={line1Ref}>
          <h2
            className="font-sans font-light leading-[0.92] tracking-[-0.02em] text-text-primary"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
          >
            Protocol utilities.
          </h2>
        </div>

        <div ref={line2Ref} className="mt-1">
          <h2
            className="font-sans font-light leading-[0.92] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
              color: "rgba(255,255,255,0.32)",
            }}
          >
            Real-world assets. AI systems.
          </h2>
        </div>

        <p
          ref={subtextRef}
          className="mt-10 max-w-[480px] font-mono text-sm leading-relaxed text-text-secondary"
        >
          Research-grade software built for Stellar and beyond.
          Each project is a piece of infrastructure designed to last.
        </p>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-10 left-6 flex items-center gap-3 md:left-16 lg:left-24"
        aria-hidden="true"
      >
        <div
          className="h-8 w-px"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
