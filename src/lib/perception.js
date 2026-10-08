/**
 * Controlled perceptual demonstrations.
 *
 * The same RGB gray square (146,146,146) is drawn over two adjustable contexts.
 * No claim of a measured perceptual effect is made.
 */
export const TARGET_GRAY = 146;
export const MIN_CONTRAST = 0;
export const MAX_CONTRAST = 100;

export function clampContrast(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(MIN_CONTRAST, Math.min(MAX_CONTRAST, Math.round(numeric)));
}

export function grayHex(level) {
  const c = Math.max(0, Math.min(255, Math.round(level)));
  return '#' + c.toString(16).padStart(2, '0').repeat(3);
}

export function contrastExperiment(level) {
  const intensity = clampContrast(level);
  return {
    intensity,
    target: grayHex(TARGET_GRAY),
    darkContext: grayHex(TARGET_GRAY - 1.28 * intensity),
    lightContext: grayHex(TARGET_GRAY + 1.09 * intensity),
  };
}

/**
 * Distances to a single vanishing point for straight perspective lines.
 * Returns ordered horizontal crossbar positions in SVG units.
 */
export function perspectiveCrossbars() {
  return [0.15, 0.28, 0.44, 0.63, 0.85].map((t) => ({
    y: 104 + (t * t) * 260,
    left: 300 - t * 260,
    right: 300 + t * 260,
  }));
}
