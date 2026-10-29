/**
 * Deliberate, discrete visitor movement inside one curated realm.
 * No continuous thumbstick movement, gravity, animation, or collision promises.
 * Positions are bounded and defined by the museum, never by artwork metadata.
 */
export const REALM_WAYPOINTS = Object.freeze([
  Object.freeze({ id: 'threshold', label: 'Portal threshold', x: 0, z: 4.8 }),
  Object.freeze({ id: 'gallery', label: 'Gallery of origins', x: 0, z: -7.7 }),
  Object.freeze({ id: 'sculptures', label: 'Sculpture chamber', x: 0, z: -17 }),
  Object.freeze({ id: 'horizon', label: 'Inner horizon', x: 0, z: -27 }),
]);

export function waypointIndex(index) {
  return Number.isInteger(index) && index >= 0 && index < REALM_WAYPOINTS.length ? index : 0;
}

export function waypointAt(index) {
  return REALM_WAYPOINTS[waypointIndex(index)];
}

export function stepWaypoint(index, direction) {
  const current = waypointIndex(index);
  if (direction !== 1 && direction !== -1) return current;
  return Math.max(0, Math.min(REALM_WAYPOINTS.length - 1, current + direction));
}

export function canStepWaypoint(index, direction, inside, inputCaptured) {
  return Boolean(inside) && !inputCaptured && stepWaypoint(index, direction) !== waypointIndex(index);
}
