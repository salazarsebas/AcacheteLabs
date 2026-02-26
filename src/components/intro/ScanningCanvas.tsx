"use client";

import { useRef, useEffect, useCallback } from "react";

interface ScanningCanvasProps {
  progress: number;
}

export function ScanningCanvas({ progress }: ScanningCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((p: number) => {
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

    if (p <= 0 || p >= 1) return;

    const x = p * width;

    // Glow effect
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    ctx.restore();

    // Trailing glow
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 3, 0);
    ctx.lineTo(x - 3, height);
    ctx.stroke();
    ctx.restore();
  }, []);

  useEffect(() => {
    draw(progress);
  }, [progress, draw]);

  useEffect(() => {
    function handleResize() {
      draw(0);
    }

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    />
  );
}
