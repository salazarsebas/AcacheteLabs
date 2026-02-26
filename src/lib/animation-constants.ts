export const DURATIONS = {
  scanLine: 2.5,
  textReveal: 2.5,
  hold: 1.5,
  fragment: 1.7,
  hubFadeIn: 1.2,
  moduleHover: 0.6,
  overlayEnter: 0.3,
} as const;

export const EASINGS = {
  smooth: "power2.inOut",
  enter: "power3.out",
  exit: "power2.in",
} as const;

export const PARTICLES = {
  maxCount: 3000,
  sampleInterval: 3,
  dispersalRange: { x: 200, y: 150 },
  minSize: 0.5,
} as const;
