"use client";

import { motion } from "motion/react";
import type { Project } from "@/types/project";

export function TechnicalOverlay({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col justify-end border border-border-hover bg-black/85 p-4 font-mono text-[10px] text-text-secondary backdrop-blur-sm"
    >
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="tracking-wider uppercase">Status</span>
          <span className="text-text-primary">{project.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="tracking-wider uppercase">Layer</span>
          <span className="text-text-primary">{project.layer}</span>
        </div>
        <div className="flex justify-between">
          <span className="tracking-wider uppercase">Stack</span>
          <span className="text-text-primary">
            {project.stack.join(" / ")}
          </span>
        </div>
        <div className="mt-3 flex gap-4">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors duration-300 hover:text-white"
            aria-label={`${project.name} repository (opens in new tab)`}
          >
            Repo
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-300 hover:text-white"
              aria-label={`${project.name} live site (opens in new tab)`}
            >
              Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
