/**
 * Local-only browser progress for Exhibition 001.
 * Visits mean an artwork was opened, not that the visitor completed a test.
 */
export const VISIT_STORAGE_KEY = 'silicon-louvre-visited-v1';

export function sanitizeVisited(candidate, artworks) {
  if (!Array.isArray(candidate)) return [];
  const permitted = new Set(artworks.map((art) => art.id));
  return [...new Set(candidate.filter((id) => typeof id === 'string' && permitted.has(id)))];
}

export function parseVisited(raw, artworks) {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try { return sanitizeVisited(JSON.parse(raw), artworks); }
  catch { return []; }
}

export function addVisit(current, id, artworks) {
  const clean = sanitizeVisited(current, artworks);
  if (!artworks.some((art) => art.id === id) || clean.includes(id)) return clean;
  return [...clean, id];
}

export function visitedCount(current, artworks) {
  return sanitizeVisited(current, artworks).length;
}
