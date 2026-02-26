"use client";

import { useRef, useEffect, useCallback } from "react";
import { PARTICLES } from "@/lib/animation-constants";

interface Particle {
  originX: number;
  originY: number;
  angle: number;
  speed: number;
  drift: number;
  size: number;
}

interface ParticleDisintegrationProps {
  active: boolean;
  progress: number;
  text: string;
}

export function ParticleDisintegration({
  active,
  progress,
  text,
}: ParticleDisintegrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const initializedRef = useRef(false);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || initializedRef.current) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Render text to sample pixels
    const fontSize = width < 768 ? 48 : width < 1024 ? 72 : 96;
    ctx.font = `300 ${fontSize}px var(--font-geist-sans), system-ui, sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = `${fontSize * 0.15}px`;
    ctx.fillText(text, width / 2, height / 2);

    // Sample pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const particles: Particle[] = [];

    const interval = PARTICLES.sampleInterval * dpr;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < canvas.height; y += interval) {
      for (let x = 0; x < canvas.width; x += interval) {
        const i = (y * canvas.width + x) * 4;
        const alpha = pixels[i + 3];

        if (alpha > 128) {
          const px = x / dpr;
          const py = y / dpr;
          const dx = px - centerX;
          const dy = py - centerY;
          const baseAngle = Math.atan2(dy, dx);

          particles.push({
            originX: px,
            originY: py,
            angle: baseAngle + (Math.random() - 0.5) * 0.5,
            speed: PARTICLES.dispersalRange.x + Math.random() * 80,
            drift: Math.random() * PARTICLES.dispersalRange.y,
            size: 1.2,
          });
        }
      }
    }

    // Limit particle count
    if (particles.length > PARTICLES.maxCount) {
      const step = Math.ceil(particles.length / PARTICLES.maxCount);
      particlesRef.current = particles.filter((_, i) => i % step === 0);
    } else {
      particlesRef.current = particles;
    }

    initializedRef.current = true;

    // Clear the text
    ctx.clearRect(0, 0, width, height);
  }, [text]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !initializedRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width * (window.devicePixelRatio || 1), height * (window.devicePixelRatio || 1));

    const particles = particlesRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    ctx.save();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Stagger based on distance from center
      const dx = p.originX - centerX;
      const dy = p.originY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normalizedDist = dist / maxDist;

      const particleProgress = Math.max(
        0,
        (progress - normalizedDist * 0.3) / 0.7
      );

      if (particleProgress <= 0) {
        // Draw at origin
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.fillRect(p.originX, p.originY, p.size, p.size);
        continue;
      }

      // Disperse using pre-computed direction
      const dispersal = particleProgress * p.speed;
      const x = p.originX + Math.cos(p.angle) * dispersal;
      const y = p.originY + Math.sin(p.angle) * dispersal - particleProgress * p.drift;

      const opacity = Math.max(0, 1 - particleProgress * 1.5);
      const size = p.size * Math.max(PARTICLES.minSize, 1 - particleProgress);

      if (opacity <= 0) continue;

      ctx.globalAlpha = opacity;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, size, size);
    }

    ctx.restore();
  }, [progress]);

  useEffect(() => {
    if (active && !initializedRef.current) {
      initParticles();
    }
  }, [active, initParticles]);

  useEffect(() => {
    if (active) {
      draw();
    }
  }, [active, progress, draw]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden="true"
    />
  );
}
