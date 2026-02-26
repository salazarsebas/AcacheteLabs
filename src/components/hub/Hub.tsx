"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectModule } from "./ProjectModule";
import { projects } from "@/data/projects";

interface HubProps {
  visible: boolean;
  revealMode: "instant" | "quick" | "cinematic";
  onReplay?: () => void;
}

const depthMap: Record<string, number> = {
  faucet: 0.8,
  explorer: 1.0,
  akkuea: 1.2,
  promptos: 0.6,
};

export function Hub({ visible, revealMode, onReplay }: HubProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);

  useMouseParallax(
    prefersReducedMotion ? { intensity: 0, smooth: 0 } : undefined
  );

  const handleHoverChange = useCallback(
    (projectId: string, hovered: boolean) => {
      setHoveredModuleId(hovered ? projectId : null);
    },
    []
  );

  const publicGoods = projects.filter((p) => p.category === "public-goods");
  const flagship = projects.filter((p) => p.category === "flagship");
  const infrastructure = projects.filter(
    (p) => p.category === "infrastructure"
  );

  // Pre-compute stagger indices per category
  const staggerOffsets = {
    publicGoods: 0,
    flagship: publicGoods.length,
    infrastructure: publicGoods.length + flagship.length,
  };

  return (
    <motion.section
      id="hub"
      initial={
        revealMode === "instant"
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: revealMode === "cinematic" ? 1.08 : 1.02 }
      }
      animate={
        visible
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: revealMode === "cinematic" ? 1.08 : 1.02 }
      }
      transition={{
        duration:
          revealMode === "cinematic" ? 1.0 : revealMode === "quick" ? 0.5 : 0,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      style={{ transformOrigin: "center center" }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10"
      aria-label="Project laboratory"
    >
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {/* Public Goods row */}
        {publicGoods.map((project, i) => (
          <ProjectModule
            key={project.id}
            project={project}
            depth={depthMap[project.id] ?? 1}
            staggerIndex={staggerOffsets.publicGoods + i}
            hubVisible={visible}
            isAnyHovered={hoveredModuleId !== null}
            isSelfHovered={hoveredModuleId === project.id}
            onHoverChange={(h) => handleHoverChange(project.id, h)}
            reducedMotion={prefersReducedMotion}
          />
        ))}

        {/* Empty cell for desktop grid alignment */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* Akkuea — spans 2 columns on desktop */}
        {flagship.map((project, i) => (
          <div key={project.id} className="md:col-span-2">
            <ProjectModule
              project={project}
              depth={depthMap[project.id] ?? 1}
              staggerIndex={staggerOffsets.flagship + i}
              hubVisible={visible}
              isAnyHovered={hoveredModuleId !== null}
              isSelfHovered={hoveredModuleId === project.id}
              onHoverChange={(h) => handleHoverChange(project.id, h)}
              reducedMotion={prefersReducedMotion}
            />
          </div>
        ))}

        {/* PromptOS */}
        {infrastructure.map((project, i) => (
          <ProjectModule
            key={project.id}
            project={project}
            depth={depthMap[project.id] ?? 1}
            staggerIndex={staggerOffsets.infrastructure + i}
            hubVisible={visible}
            isAnyHovered={hoveredModuleId !== null}
            isSelfHovered={hoveredModuleId === project.id}
            onHoverChange={(h) => handleHoverChange(project.id, h)}
            reducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {onReplay && (
        <button
          onClick={onReplay}
          className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-40"
          style={{ color: "rgba(255,255,255,0.12)" }}
          aria-label="Replay intro animation"
        >
          Replay sequence
        </button>
      )}
    </motion.section>
  );
}
