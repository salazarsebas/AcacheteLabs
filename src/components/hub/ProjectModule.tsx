"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TechnicalOverlay } from "./TechnicalOverlay";
import type { Project } from "@/types/project";

interface ProjectModuleProps {
  project: Project;
  depth: number;
}

export function ProjectModule({ project, depth }: ProjectModuleProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isDominant = project.visualWeight === "dominant";
  const isDistinct = project.visualWeight === "distinct";

  return (
    <motion.article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      className={`relative cursor-default border border-border-module bg-white/[0.02] transition-colors duration-600 ${
        isDominant ? "min-h-[280px] p-8" : "min-h-[200px] p-6"
      } ${isDistinct ? "grayscale-[30%]" : ""}`}
      style={{
        transform: `translate(calc(var(--parallax-x, 0px) * ${depth}), calc(var(--parallax-y, 0px) * ${depth}))`,
      }}
      whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
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
        {isHovered && <TechnicalOverlay project={project} />}
      </AnimatePresence>
    </motion.article>
  );
}
