/**
 * Pure helpers used by the Gallery Walk and shareable artwork links.
 * The tour follows the curator's defined artwork order, not the active filter.
 */
export function getArtworkById(works, id) {
  return works.find((work) => work.id === id) ?? null;
}

export function nextArtworkId(works, currentId, step = 1) {
  if (!works.length) return null;
  const index = works.findIndex((work) => work.id === currentId);
  if (index < 0) return works[0].id;
  const next = ((index + step) % works.length + works.length) % works.length;
  return works[next].id;
}

export function artworkPosition(works, currentId) {
  const index = works.findIndex((work) => work.id === currentId);
  return index < 0 ? 0 : index + 1;
}

export function artworkIdFromHash(works, hash) {
  const match = /^#work-([a-z0-9-]+)$/.exec(hash);
  return match && getArtworkById(works, match[1]) ? match[1] : null;
}

export function artworkShareUrl(origin, pathname, artworkId) {
  return new URL(`#work-${artworkId}`, new URL(pathname, origin)).href;
}
