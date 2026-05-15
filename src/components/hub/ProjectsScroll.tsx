"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { ProjectSlide } from "./ProjectSlide";
import type { Project } from "@/types/project";

interface ProjectsScrollProps {
  projects: Project[];
  onReplay?: () => void;
}

export function ProjectsScroll({ projects, onReplay }: ProjectsScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);

  const SCROLL_PER_SLIDE = 100;

  useGSAP(
    () => {
      if (!wrapperRef.current) return;

      const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      const dots = dotRefs.current.filter(Boolean) as HTMLDivElement[];
      if (slides.length === 0) return;

      const totalSlides = slides.length;

      slides.forEach((slide, i) => {
        gsap.set(slide, {
          opacity: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 30,
          scale: i === 0 ? 1 : 0.97,
          pointerEvents: i === 0 ? "auto" : "none",
        });
      });

      dots.forEach((dot, i) => {
        gsap.set(dot, {
          opacity: i === 0 ? 0.9 : 0.2,
          scale: i === 0 ? 1 : 0.6,
        });
      });

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const segmentSize = 1 / totalSlides;
          const activeIndex = Math.min(
            Math.floor(self.progress / segmentSize),
            totalSlides - 1
          );

          slides.forEach((slide, idx) => {
            const isActive = idx === activeIndex;
            const isPrev = idx < activeIndex;

            gsap.to(slide, {
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : isPrev ? -20 : 30,
              scale: isActive ? 1 : isPrev ? 1.01 : 0.97,
              duration: 0.55,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.set(slide, { pointerEvents: isActive ? "auto" : "none" });
          });

          dots.forEach((dot, idx) => {
            gsap.to(dot, {
              opacity: idx === activeIndex ? 0.9 : 0.2,
              scale: idx === activeIndex ? 1 : 0.6,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          });

          if (labelRef.current) {
            labelRef.current.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;
          }
        },
      });
    },
    { scope: wrapperRef, dependencies: [] }
  );

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${projects.length * SCROLL_PER_SLIDE}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section header — spaced below the fixed main header (~60px) */}
        <div className="absolute left-6 top-[72px] z-10 flex items-center gap-4 md:left-16 lg:left-24">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-text-muted">
            Projects
          </span>
          <span
            className="h-px w-8"
            style={{ background: "rgba(255,255,255,0.08)" }}
            aria-hidden="true"
          />
          <span
            ref={labelRef}
            className="font-mono text-[9px] tabular-nums tracking-[0.2em] text-text-muted"
            aria-live="polite"
            aria-label="Current project"
          >
            01 / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Slides */}
        {projects.map((project, i) => (
          <ProjectSlide
            key={project.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            project={project}
            index={i}
          />
        ))}

        {/* Progress dots */}
        <div
          className="absolute bottom-10 right-6 flex flex-col items-center gap-2.5 md:right-16 lg:right-24"
          aria-hidden="true"
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="h-1 w-1 rounded-full bg-white"
            />
          ))}
        </div>

        {/* Replay button — inside sticky viewport so it never requires extra scroll */}
        {onReplay && (
          <div className="absolute bottom-10 left-6 md:left-16 lg:left-24">
            <button
              onClick={onReplay}
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted transition-colors duration-300 hover:text-text-secondary"
              aria-label="Replay intro animation"
            >
              Replay sequence
            </button>
          </div>
        )}

        {/* Bottom edge fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
