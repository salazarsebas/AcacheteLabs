"use client";

import { useRef, useEffect, useCallback } from "react";
import { PARTICLES } from "@/lib/animation-constants";
import { turbulence } from "@/lib/noise";

interface Particle {
  originX: number;
  originY: number;
  angle: number;
  speed: number;
  drift: number;
  size: number;
  distFromCenter: number;
  trail: { x: number; y: number }[];
  phaseOffset: number;
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
  const progressRef = useRef(progress);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

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
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < canvas.height; y += interval) {
      for (let x = 0; x < canvas.width; x += interval) {
        const i = (y * canvas.width + x) * 4;
        const alpha = pixels[i + 3];

        if (alpha > 128) {
          const px = x / dpr;
          const py = y / dpr;
          const dx = px - centerX;
          const dy = py - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const baseAngle = Math.atan2(dy, dx);

          particles.push({
            originX: px,
            originY: py,
            angle: baseAngle + (Math.random() - 0.5) * 0.5,
            speed: PARTICLES.dispersalRange.x + Math.random() * 80,
            drift: Math.random() * PARTICLES.dispersalRange.y,
            size: 1.2,
            distFromCenter: dist / maxDist,
            trail: [],
            phaseOffset: Math.random() * Math.PI * 2,
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
    ctx.clearRect(0, 0, width, height);
  }, [text]);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !initializedRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width * dpr, height * dpr);

    const particles = particlesRef.current;
    const p = progressRef.current;
    const t = time * 0.001;

    ctx.save();

    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];

      // Inverted stagger: center particles move first, edges last
      const staggerFactor = 1 - pt.distFromCenter;
      const particleProgress = Math.max(
        0,
        (p - (1 - staggerFactor) * 0.4) / 0.6
      );

      if (particleProgress <= 0) {
        // Draw at origin
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.fillRect(pt.originX, pt.originY, pt.size, pt.size);
        continue;
      }

      // Base dispersal
      const dispersal = particleProgress * pt.speed;
      let x = pt.originX + Math.cos(pt.angle) * dispersal;
      let y =
        pt.originY +
        Math.sin(pt.angle) * dispersal -
        particleProgress * pt.drift;

      // Add turbulence
      const turb = turbulence(
        pt.originX,
        pt.originY,
        t + particleProgress * 3,
        PARTICLES.turbulenceScale,
        PARTICLES.turbulenceStrength * particleProgress
      );
      x += turb.x;
      y += turb.y;

      // Update trail
      pt.trail.push({ x, y });
      if (pt.trail.length > PARTICLES.trailLength) {
        pt.trail.shift();
      }

      // Size oscillation
      const sizeBase =
        pt.size * Math.max(PARTICLES.minSize, 1 - particleProgress);
      const sizeOsc =
        1 +
        Math.sin(t * 4 + pt.phaseOffset) * PARTICLES.sizeOscillation;
      const finalSize = sizeBase * sizeOsc;

      const opacity = Math.max(0, 1 - particleProgress * 1.5);
      if (opacity <= 0) continue;

      // Draw trails (fading older positions)
      for (let tr = 0; tr < pt.trail.length - 1; tr++) {
        const trailOpacity = opacity * (tr / pt.trail.length) * 0.3;
        const trailSize =
          finalSize * (0.4 + 0.6 * (tr / pt.trail.length));

        ctx.globalAlpha = trailOpacity;
        ctx.fillStyle = "white";
        ctx.fillRect(
          pt.trail[tr].x,
          pt.trail[tr].y,
          trailSize,
          trailSize
        );
      }

      // Draw main particle with glow (every 4th particle)
      ctx.globalAlpha = opacity;
      if (i % 4 === 0) {
        ctx.shadowBlur = PARTICLES.glowRadius;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.4})`;
      }
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, finalSize, finalSize);

      if (i % 4 === 0) {
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    if (active && !initializedRef.current) {
      initParticles();
    }
  }, [active, initParticles]);

  // Continuous rAF loop for turbulence and size oscillation
  useEffect(() => {
    if (!active || !initializedRef.current) return;

    function loop(time: number) {
      draw(time);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active, draw]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden="true"
    />
  );
}
