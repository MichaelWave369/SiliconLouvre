/**
 * Pure XR hit routing shared by controller and desktop pointer.
 * Returns semantic intent; this module never moves a camera, invokes a host
 * action, or grants Gen.E.Wrist capability by itself.
 */
const NONE = Object.freeze({ type: 'none' });
const BLOCKED = Object.freeze({ type: 'blocked' });

function firstHit(ray, objects) {
  const candidates = objects.filter((object) => object && object.visible);
  return candidates.length ? ray.intersectObjects(candidates, false)[0] || null : null;
}

export function resolveXRTarget(ray, {
  inside = false,
  wristOpen = false,
  wristCaptured = false,
  wristPanel = null,
  wristLauncher = null,
  wristSurface = null,
  returnTargets = [],
  travelSigns = [],
  portalTargets = [],
} = {}) {
  // The wrist always owns this ray while expanded, even if a visitor misses
  // the panel. Never allow misses to fall through into painting interactions.
  if (wristOpen) {
    const hit = firstHit(ray, [wristPanel]);
    if (!hit?.uv || !wristSurface?.canvas || !Array.isArray(wristSurface.targets)) return BLOCKED;
    const x = hit.uv.x * wristSurface.canvas.width;
    const y = (1 - hit.uv.y) * wristSurface.canvas.height;
    const target = wristSurface.targets.find((t) =>
      typeof t.action === 'function' &&
      x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h
    );
    return target ? { type: 'wrist-control', target } : BLOCKED;
  }

  if (wristCaptured) return BLOCKED;
  if (firstHit(ray, [wristLauncher])) return { type: 'wrist-launcher' };

  const hit = firstHit(ray, inside
    ? [...returnTargets, ...travelSigns]
    : portalTargets);
  if (!hit) return NONE;
  const info = hit.object.userData || {};
  if (inside && info.returnToAtrium === true) return { type: 'return' };
  if (inside && (info.direction === -1 || info.direction === 1)) {
    return { type: 'waypoint', direction: info.direction };
  }
  if (!inside && Number.isInteger(info.stopIndex) && info.stopIndex >= 0) {
    return { type: 'painting', index: info.stopIndex };
  }
  return NONE;
}

export function isActionableTarget(result) {
  return ['wrist-control', 'wrist-launcher', 'return', 'waypoint', 'painting'].includes(result?.type);
}
