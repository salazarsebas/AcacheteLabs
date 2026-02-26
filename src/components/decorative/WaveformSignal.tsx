"use client";

import { useRef, useEffect, useCallback } from "react";
import { WAVEFORM } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function WaveformSignal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

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
    const scrollOffset = t * WAVEFORM.scrollSpeed;

    ctx.lineWidth = WAVEFORM.lineWidth;
    ctx.strokeStyle = `rgba(255, 255, 255, ${WAVEFORM.opacity})`;

    // Left waveform
    ctx.beginPath();
    for (let y = 0; y < h; y += 2) {
      const displacement =
        Math.sin((y + scrollOffset * 100) * WAVEFORM.frequency) *
        WAVEFORM.amplitude;
      const x = WAVEFORM.edgeOffset + displacement;

      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Right waveform (phase-shifted)
    ctx.beginPath();
    for (let y = 0; y < h; y += 2) {
      const displacement =
        Math.sin((y + scrollOffset * 100) * WAVEFORM.frequency + Math.PI * 0.7) *
        WAVEFORM.amplitude;
      const x = w - WAVEFORM.edgeOffset + displacement;

      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
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
