"use client";

import { useRef, useEffect, useCallback } from "react";
import { AMBIENT } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phaseOffset: number;
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DustParticle[]>([]);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  // Initialize particles
  useEffect(() => {
    if (prefersReducedMotion) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    particlesRef.current = Array.from(
      { length: AMBIENT.particleCount },
      () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: lerp(AMBIENT.minSpeed, AMBIENT.maxSpeed, Math.random()) * (Math.random() > 0.5 ? 1 : -1),
        vy: lerp(AMBIENT.minSpeed, AMBIENT.maxSpeed, Math.random()) * (Math.random() > 0.5 ? 1 : -1),
        size: lerp(AMBIENT.minSize, AMBIENT.maxSize, Math.random()),
        opacity: lerp(AMBIENT.minOpacity, AMBIENT.maxOpacity, Math.random()),
        phaseOffset: Math.random() * Math.PI * 2,
      })
    );
  }, [prefersReducedMotion]);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const expectedW = w * dpr;
    const expectedH = h * dpr;
    if (canvas.width !== expectedW || canvas.height !== expectedH) {
      canvas.width = expectedW;
      canvas.height = expectedH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    const t = time * 0.001;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Brownian drift
      const driftX = Math.sin(t * AMBIENT.driftFrequency + p.phaseOffset) * AMBIENT.driftAmplitude;
      const driftY = Math.cos(t * AMBIENT.driftFrequency * 0.7 + p.phaseOffset + 1.5) * AMBIENT.driftAmplitude;

      p.x += p.vx + driftX * 0.1;
      p.y += p.vy + driftY * 0.1;

      // Wrap around
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5;
      if (p.y > h + 5) p.y = -5;

      // Draw particle
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, []);

  // rAF loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    function loop(time: number) {
      draw(time);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [prefersReducedMotion, draw]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
