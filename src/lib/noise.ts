/**
 * Sine-based noise approximation.
 * Combines multiple octaves of sine waves to create pseudo-random,
 * continuous noise without any external library.
 * Returns values roughly in the range [-1, 1].
 */
export function sineNoise2D(x: number, y: number): number {
  let value = 0;
  value += Math.sin(x * 1.0 + y * 1.7) * 0.5;
  value += Math.sin(x * 2.3 - y * 1.3 + 1.3) * 0.25;
  value += Math.sin(x * 4.1 + y * 3.7 + 2.7) * 0.125;
  value += Math.sin(x * 8.2 - y * 7.1 + 4.1) * 0.0625;
  return value;
}

/**
 * Get a 2D turbulence displacement vector from noise.
 */
export function turbulence(
  px: number,
  py: number,
  time: number,
  scale: number,
  strength: number
): { x: number; y: number } {
  return {
    x: sineNoise2D(px * scale + time * 0.5, py * scale) * strength,
    y: sineNoise2D(px * scale, py * scale + time * 0.5 + 100) * strength,
  };
}
