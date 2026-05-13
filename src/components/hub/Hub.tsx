"use client";

import { motion } from "motion/react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroSection } from "./HeroSection";
import { ProjectsScroll } from "./ProjectsScroll";
import { projects } from "@/data/projects";

interface HubProps {
  visible: boolean;
  revealMode: "instant" | "quick" | "cinematic";
  onReplay?: () => void;
}

export function Hub({ visible, revealMode, onReplay }: HubProps) {
  const prefersReducedMotion = useReducedMotion();

  useMouseParallax(
    prefersReducedMotion ? { intensity: 0, smooth: 0 } : undefined
  );

  return (
    <motion.div
      initial={
        revealMode === "instant"
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: revealMode === "cinematic" ? 1.04 : 1.01 }
      }
      animate={
        visible
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: revealMode === "cinematic" ? 1.04 : 1.01 }
      }
      transition={{
        duration:
          revealMode === "cinematic" ? 1.1 : revealMode === "quick" ? 0.5 : 0,
        ease: [0.22, 0.1, 0.22, 1.0],
      }}
      style={{ transformOrigin: "center top" }}
    >
      <HeroSection visible={visible} />
      <ProjectsScroll projects={projects} />

      {onReplay && (
        <div className="flex justify-center py-24">
          <button
            onClick={onReplay}
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted transition-opacity duration-300 hover:text-text-secondary"
            aria-label="Replay intro animation"
          >
            Replay sequence
          </button>
        </div>
      )}
    </motion.div>
  );
}
