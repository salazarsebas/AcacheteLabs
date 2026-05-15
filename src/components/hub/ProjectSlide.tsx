"use client";

import { forwardRef } from "react";
import type { Project, ProjectStatus } from "@/types/project";

const ACCENT: Record<string, string> = {
  faucet: "rgba(147, 210, 255, 0.055)",
  explorer: "rgba(134, 239, 172, 0.04)",
  akkuea: "rgba(253, 186, 116, 0.06)",
  promptos: "rgba(196, 181, 253, 0.05)",
};

const ACCENT_BORDER: Record<string, string> = {
  faucet: "rgba(147, 210, 255, 0.14)",
  explorer: "rgba(134, 239, 172, 0.12)",
  akkuea: "rgba(253, 186, 116, 0.18)",
  promptos: "rgba(196, 181, 253, 0.14)",
};

const ACCENT_TEXT: Record<string, string> = {
  faucet: "rgba(147, 210, 255, 0.7)",
  explorer: "rgba(134, 239, 172, 0.7)",
  akkuea: "rgba(253, 186, 116, 0.7)",
  promptos: "rgba(196, 181, 253, 0.7)",
};

const STATUS_LABEL: Record<string, string> = {
  Active: "Active",
  "In Progress": "In progress",
  Experimental: "Experimental",
};

const CATEGORY_LABEL: Record<string, string> = {
  "public-goods": "Protocol Utility",
  flagship: "Flagship",
  infrastructure: "AI Infrastructure",
};

interface ProjectSlideProps {
  project: Project;
  index: number;
}

export const ProjectSlide = forwardRef<HTMLDivElement, ProjectSlideProps>(
  ({ project, index }, ref) => {
    const ordinal = String(index + 1).padStart(2, "0");
    const accent = ACCENT[project.id] ?? "rgba(255,255,255,0.02)";
    const accentBorder = ACCENT_BORDER[project.id] ?? "rgba(255,255,255,0.08)";
    const accentText = ACCENT_TEXT[project.id] ?? "rgba(255,255,255,0.5)";
    const isDominant = project.visualWeight === "dominant";

    return (
      <div
        ref={ref}
        className="absolute inset-0 flex items-center justify-center px-6 md:px-16 lg:px-24"
        style={{ opacity: 0 }}
      >
        <div className="relative w-full max-w-[900px]">
          {/* Background ordinal */}
          <span
            className="pointer-events-none absolute -right-4 -top-10 select-none font-mono font-bold leading-none text-white/[0.025] md:-right-8 md:-top-16"
            style={{ fontSize: "clamp(7rem, 18vw, 16rem)" }}
            aria-hidden="true"
          >
            {ordinal}
          </span>

          {/* Category + status row */}
          <div className="mb-8 flex items-center gap-6">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.35em]"
              style={{ color: accentText }}
            >
              {CATEGORY_LABEL[project.category]}
            </span>
            <span
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${accentBorder} 0%, rgba(255,255,255,0) 100%)`,
              }}
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    project.status === "Active"
                      ? accentText
                      : "rgba(255,255,255,0.18)",
                }}
                aria-hidden="true"
              />
              {STATUS_LABEL[project.status as keyof typeof STATUS_LABEL]}
            </span>
          </div>

          {/* Project name */}
          <h3
            className="font-sans font-light leading-[0.88] tracking-[-0.02em] text-text-primary"
            style={{
              fontSize: isDominant
                ? "clamp(3.4rem, 9vw, 8.5rem)"
                : "clamp(2.8rem, 7.5vw, 7rem)",
            }}
          >
            {project.name}
          </h3>

          {/* Divider */}
          <div
            className="my-8 h-px"
            style={{
              background: `linear-gradient(90deg, ${accentBorder} 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)`,
            }}
            aria-hidden="true"
          />

          {/* Description */}
          <p
            className="max-w-[520px] font-mono text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {project.description}
          </p>

          {/* Stack + links row */}
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-sm px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em]"
                  style={{
                    background: accent,
                    border: `1px solid ${accentBorder}`,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-all duration-200 hover:border-white/25 hover:bg-white/[0.04] hover:text-text-primary"
                  aria-label={`${project.name} source code repository`}
                >
                  <span>Repo</span>
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-200 hover:bg-white/[0.04]"
                  style={{
                    color: accentText,
                    borderColor: accentBorder,
                  }}
                  aria-label={`${project.name} live application`}
                >
                  <span>Live</span>
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProjectSlide.displayName = "ProjectSlide";
