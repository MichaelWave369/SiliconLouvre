/**
 * Static, local, image-only comparison controls for the Dialogues museum wing.
 * No image modification or network calls. Values are constrained before use.
 */
export const COMPARISON_MODES = Object.freeze(['side-by-side','reveal','blend']);

export function normalizeComparisonMode(mode) {
  return COMPARISON_MODES.includes(mode) ? mode : 'side-by-side';
}

export function clampComparisonValue(value) {
  const number=Number(value);
  return Number.isFinite(number) ? Math.min(100,Math.max(0,Math.round(number))) : 50;
}

export function revealClipStyle(value) {
  return {clipPath:'inset(0 '+(100-clampComparisonValue(value))+'% 0 0)'};
}

export function blendOpacityStyle(value) {
  return {opacity:clampComparisonValue(value)/100};
}

export function comparisonStatus(mode,value) {
  const n=clampComparisonValue(value);
  if(mode==='reveal')return n+'% of the AI-inspired response revealed from the left.';
  if(mode==='blend')return 'AI-inspired image opacity '+n+'%; original drawing is underneath.';
  return 'Both complete artworks are visible side by side.';
}
