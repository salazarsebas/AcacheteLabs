"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectModule } from "./ProjectModule";
import { projects } from "@/data/projects";

interface HubProps {
  visible: boolean;
}

const depthMap: Record<string, number> = {
  faucet: 0.8,
  explorer: 1.0,
  akkuea: 1.2,
  promptos: 0.6,
};

export function Hub({ visible }: HubProps) {
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

  // Stagger indices: publicGoods(0,1), flagship(2), infrastructure(3)
  let staggerIdx = 0;

  return (
    <motion.section
      id="hub"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
      }
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 md:px-10"
      aria-label="Project laboratory"
    >
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {/* Public Goods row */}
        {publicGoods.map((project) => {
          const idx = staggerIdx++;
          return (
            <ProjectModule
              key={project.id}
              project={project}
              depth={depthMap[project.id] ?? 1}
              staggerIndex={idx}
              hubVisible={visible}
              isAnyHovered={hoveredModuleId !== null}
              isSelfHovered={hoveredModuleId === project.id}
              onHoverChange={(h) => handleHoverChange(project.id, h)}
              reducedMotion={prefersReducedMotion}
            />
          );
        })}

        {/* Empty cell for desktop grid alignment */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* Akkuea — spans 2 columns on desktop */}
        {flagship.map((project) => {
          const idx = staggerIdx++;
          return (
            <div key={project.id} className="md:col-span-2">
              <ProjectModule
                project={project}
                depth={depthMap[project.id] ?? 1}
                staggerIndex={idx}
                hubVisible={visible}
                isAnyHovered={hoveredModuleId !== null}
                isSelfHovered={hoveredModuleId === project.id}
                onHoverChange={(h) => handleHoverChange(project.id, h)}
                reducedMotion={prefersReducedMotion}
              />
            </div>
          );
        })}

        {/* PromptOS */}
        {infrastructure.map((project) => {
          const idx = staggerIdx++;
          return (
            <ProjectModule
              key={project.id}
              project={project}
              depth={depthMap[project.id] ?? 1}
              staggerIndex={idx}
              hubVisible={visible}
              isAnyHovered={hoveredModuleId !== null}
              isSelfHovered={hoveredModuleId === project.id}
              onHoverChange={(h) => handleHoverChange(project.id, h)}
              reducedMotion={prefersReducedMotion}
            />
          );
        })}
      </div>
    </motion.section>
  );
}
