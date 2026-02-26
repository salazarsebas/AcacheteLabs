"use client";

import { useRef, useEffect, useCallback } from "react";
import { SCANNER } from "@/lib/animation-constants";

interface ScanningCanvasProps {
  progress: number;
  active: boolean;
}

export function ScanningCanvas({ progress, active }: ScanningCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const p = progressRef.current;
    if (p <= 0 || p >= 1) return;

    const x = p * width;
    const t = time * 0.001;

    // 1. Wide trailing energy field (gradient)
    const gradient = ctx.createLinearGradient(
      x - SCANNER.glowWidth,
      0,
      x,
      0
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.03)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.08)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x - SCANNER.glowWidth, 0, SCANNER.glowWidth, height);

    // 2. Main scan line with vertical jitter
    const jitter =
      Math.sin(t * SCANNER.jitterFrequency) * SCANNER.jitterAmplitude;

    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + jitter, 0);
    ctx.lineTo(x + jitter, height);
    ctx.stroke();
    ctx.restore();

    // 3. Secondary trailing line
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - 4, 0);
    ctx.lineTo(x - 4, height);
    ctx.stroke();
    ctx.restore();

    // 4. Horizontal interference lines along the beam
    for (let i = 0; i < SCANNER.interferenceLines; i++) {
      const lineY = (height / (SCANNER.interferenceLines + 1)) * (i + 1);
      const lineJitter = Math.sin(t * 8 + i * 2) * 2;
      const lineAlpha = 0.15 + Math.sin(t * 6 + i) * 0.1;

      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.05, lineAlpha)})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x - 15 + lineJitter, lineY);
      ctx.lineTo(x + 15 + lineJitter, lineY);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Grid intersection markers (flash as scan passes)
    const gridH = [0.2, 0.4, 0.6, 0.8];
    const gridV = [0.25, 0.5, 0.75];

    for (const gv of gridV) {
      const gx = gv * width;
      const dist = Math.abs(x - gx);

      if (dist < SCANNER.glowWidth) {
        const brightness = 1 - dist / SCANNER.glowWidth;

        for (const gh of gridH) {
          const gy = gh * height;
          const halfSize = SCANNER.gridMarkerSize / 2;

          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.4})`;
          ctx.lineWidth = 0.5;

          // Small crosshair at intersection
          ctx.beginPath();
          ctx.moveTo(gx - halfSize, gy);
          ctx.lineTo(gx + halfSize, gy);
          ctx.moveTo(gx, gy - halfSize);
          ctx.lineTo(gx, gy + halfSize);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }, []);

  // Continuous rAF loop for jitter and interference animation
  useEffect(() => {
    if (!active) return;

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
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    />
  );
}
