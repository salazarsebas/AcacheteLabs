"use client";

import { useEffect, useRef, useCallback } from "react";

interface ParallaxConfig {
  intensity?: number;
  smooth?: number;
}

export function useMouseParallax({
  intensity = 0.02,
  smooth = 0.1,
}: ParallaxConfig = {}) {
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetRef.current = {
        x: (e.clientX - centerX) * intensity,
        y: (e.clientY - centerY) * intensity,
      };
    },
    [intensity]
  );

  useEffect(() => {
    const root = document.documentElement;

    function animate() {
      positionRef.current.x +=
        (targetRef.current.x - positionRef.current.x) * smooth;
      positionRef.current.y +=
        (targetRef.current.y - positionRef.current.y) * smooth;

      root.style.setProperty(
        "--parallax-x",
        `${positionRef.current.x}px`
      );
      root.style.setProperty(
        "--parallax-y",
        `${positionRef.current.y}px`
      );

      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, smooth]);
}
