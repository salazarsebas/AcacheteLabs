// === INTRO: Door (sliding panel) ===
export const DOOR = {
  restDisplace: 4,
  openDisplace: 20,
  expandDuration: 0.8,
  seamGlowRest: 0.4,
  seamGlowOpen: 0.9,
} as const;

// === INTRO: Letter Choreography ===
export const LETTER = {
  stagger: 0.18,
  slideDuration: 0.45,
  scanDuration: 0.4,
  scanToSlideDelay: 0.1,
  glowDuration: 0.3,
  slideEase: "power2.out",
} as const;

// === INTRO: Micro-Detail Overlay ===
export const MICRO_DETAIL = {
  displayDuration: 0.18,
  fadeDuration: 0.08,
} as const;

// === INTRO: Post-Animation ===
export const POST_ANIM = {
  holdDuration: 0.8,
  zoomOutDuration: 1.0,
  hubInitialScale: 1.08,
} as const;

// === INTRO: Compact (Return Visit) ===
export const COMPACT = {
  doorExpandDuration: 0.2,
  stagger: 0.03,
  slideDuration: 0.25,
  fadeDuration: 0.2,
} as const;

// === Hub & Module Durations ===
export const DURATIONS = {
  hubFadeIn: 1.2,
  moduleHover: 0.6,
  overlayEnter: 0.3,
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
  cinematic: "power2.out",
} as const;

export const GRID = {
  proximityRadius: 200,
  baseOpacity: 0.06,
  activeOpacity: 0.25,
  pulseAmplitude: 0.02,
} as const;

export const AMBIENT = {
  particleCount: 60,
  minSize: 0.8,
  maxSize: 2,
  minOpacity: 0.04,
  maxOpacity: 0.12,
  minSpeed: 0.1,
  maxSpeed: 0.3,
  driftAmplitude: 0.3,
  driftFrequency: 0.5,
} as const;

export const WAVEFORM = {
  amplitude: 15,
  frequency: 0.015,
  scrollSpeed: 0.4,
  lineWidth: 0.5,
  opacity: 0.06,
  edgeOffset: 30,
} as const;
