/** Curated, local-only, opt-in XR stops. Artwork images remain unchanged. */
export function createPortalStops(pairs) {
  if (!Array.isArray(pairs)) return [];
  const seen = new Set();
  return pairs.filter((pair) => {
    if (!pair || pair.status !== 'approved') return false;
    if (!pair.provenance?.originalOwnerApproved || !pair.provenance?.inspiredImageApproved) return false;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pair.id || '') || seen.has(pair.id)) return false;
    if (![pair.original?.file, pair.inspired?.file].every((file) => typeof file === 'string' && /^[a-z0-9-]+\.webp$/.test(file))) return false;
    seen.add(pair.id);
    return true;
  }).map((pair, index) => Object.freeze({
    id: pair.id, index, title: pair.title,
    originalFile: pair.original.file, inspiredFile: pair.inspired.file,
    originalAlt: pair.original.alt, inspiredAlt: pair.inspired.alt,
    originalCredit: pair.originalCredit, inspiredCredit: pair.inspiredCredit,
    note: pair.curatorialNote,
  }));
}
export function portalAt(stops, index) {
  if (!stops.length) return null;
  return stops[((index % stops.length) + stops.length) % stops.length];
}
export function portalById(stops, id) {
  return stops.find((stop) => stop.id === id) || null;
}
