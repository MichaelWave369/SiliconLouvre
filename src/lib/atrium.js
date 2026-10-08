/**
 * A simple fixed-exhibition index model for the virtual atrium.
 * This is not a simulated user-location model: it is a curator-ordered
 * viewing room with focusable artwork and explicit next/previous controls.
 */
export function wrapAtriumIndex(length, index) {
  if (!Number.isInteger(length) || length < 1) return -1;
  if (!Number.isInteger(index)) return -1;
  return ((index % length) + length) % length;
}

export function atriumNeighbors(works, index) {
  if (!Array.isArray(works) || !works.length) return [];
  const active = wrapAtriumIndex(works.length, index);
  if (active < 0) return [];
  if (works.length === 1) return [{ work: works[0], position: 'center' }];
  if (works.length === 2) return [
    { work: works[active], position: 'center' },
    { work: works[wrapAtriumIndex(2, active + 1)], position: 'right' },
  ];
  return [
    { work: works[wrapAtriumIndex(works.length, active - 1)], position: 'left' },
    { work: works[active], position: 'center' },
    { work: works[wrapAtriumIndex(works.length, active + 1)], position: 'right' },
  ];
}

export function atriumWorkAt(works, index) {
  const at = wrapAtriumIndex(works.length, index);
  return at < 0 ? null : works[at];
}
