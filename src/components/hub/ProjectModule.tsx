"use client";

import { motion, AnimatePresence } from "motion/react";
import { TechnicalOverlay } from "./TechnicalOverlay";
import { DURATIONS } from "@/lib/animation-constants";
import type { Project } from "@/types/project";

interface ProjectModuleProps {
  project: Project;
  depth: number;
  staggerIndex?: number;
  hubVisible?: boolean;
  isAnyHovered?: boolean;
  isSelfHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  reducedMotion?: boolean;
}

export function ProjectModule({
  project,
  depth,
  staggerIndex = 0,
  hubVisible = false,
  isAnyHovered = false,
  isSelfHovered = false,
  onHoverChange,
  reducedMotion = false,
}: ProjectModuleProps) {
  const isDominant = project.visualWeight === "dominant";
  const isDistinct = project.visualWeight === "distinct";
  const dimmed = isAnyHovered && !isSelfHovered;

  const delay = staggerIndex * DURATIONS.moduleStagger;

  return (
    <motion.article
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      tabIndex={0}
      className={`relative cursor-default border border-border-module bg-white/[0.02] ${
        isDominant ? "min-h-[280px] p-8" : "min-h-[200px] p-6"
      } ${isDistinct ? "grayscale-[30%]" : ""}`}
      style={{
        transform: `translate(calc(var(--parallax-x, 0px) * ${depth}), calc(var(--parallax-y, 0px) * ${depth}))`,
        opacity: dimmed ? 0.45 : 1,
        transition: "opacity 0.4s ease, border-color 0.6s ease",
      }}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
      animate={
        hubVisible
          ? { opacity: dimmed ? 0.45 : 1, scale: 1 }
          : reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: hubVisible ? delay : 0,
        ease: "easeOut",
      }}
      whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
      aria-label={`Project: ${project.name}`}
    >
      {project.category === "public-goods" && (
        <span className="mb-4 block font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted">
          Protocol Utility
        </span>
      )}
      {project.category === "infrastructure" && (
        <span className="mb-4 block font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted">
          AI Infrastructure
        </span>
      )}

      <h3 className="font-sans text-lg tracking-wide text-text-primary">
        {project.name}
      </h3>
      <p className="mt-2 font-mono text-xs leading-relaxed text-text-secondary">
        {project.description}
      </p>

      {project.status !== "Active" && (
        <span className="mt-4 inline-block font-mono text-[9px] uppercase tracking-wider text-text-muted">
          {project.status}
        </span>
      )}

      <AnimatePresence>
        {isSelfHovered && <TechnicalOverlay project={project} />}
      </AnimatePresence>
    </motion.article>
  );
}
