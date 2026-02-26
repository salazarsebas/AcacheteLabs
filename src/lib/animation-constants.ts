export const DURATIONS = {
  scanLine: 2.5,
  textReveal: 2.5,
  hold: 1.5,
  fragment: 1.7,
  hubFadeIn: 1.2,
  moduleHover: 0.6,
  overlayEnter: 0.3,
  letterWalk: 0.6,
  letterStagger: 0.12,
  holdBreathing: 2.0,
  moduleStagger: 0.15,
  gridPulse: 4.0,
  cornerBlink: 3.0,
  cadRotation: 30,
  microLabelStagger: 0.2,
} as const;

export const EASINGS = {
  smooth: "power2.inOut",
  enter: "power3.out",
  exit: "power2.in",
  elastic: "elastic.out(1, 0.4)",
} as const;

export const PARTICLES = {
  maxCount: 3000,
  sampleInterval: 3,
  dispersalRange: { x: 200, y: 150 },
  minSize: 0.5,
  trailLength: 4,
  turbulenceScale: 0.003,
  turbulenceStrength: 60,
  sizeOscillation: 0.3,
  glowRadius: 4,
  alphaThreshold: 128,
} as const;

export const SCANNER = {
  interferenceLines: 5,
  jitterAmplitude: 1.5,
  jitterFrequency: 12,
  glowWidth: 40,
  gridMarkerSize: 6,
} as const;

export const GRID = {
  proximityRadius: 200,
  baseOpacity: 0.06,
  activeOpacity: 0.25,
  pulseAmplitude: 0.02,
} as const;
