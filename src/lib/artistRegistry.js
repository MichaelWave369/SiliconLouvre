export const APPROVED_ARTIST_KINDS = Object.freeze(['human', 'agent', 'collaboration']);

export function publishedArtists(entries) {
  return entries.filter((artist) => artist.status === 'approved');
}

export function artistById(entries, id) {
  return publishedArtists(entries).find((artist) => artist.id === id) ?? null;
}

export function validateArtistRegistry(entries, exhibitionIds) {
  const errors = [];
  const seen = new Set();
  const exhibits = new Set(exhibitionIds);
  for (const artist of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(artist.id || '')) errors.push('Invalid artist ID');
    if (seen.has(artist.id)) errors.push('Duplicate artist ID: ' + artist.id);
    seen.add(artist.id);
    if (!APPROVED_ARTIST_KINDS.includes(artist.kind)) errors.push('Unknown artist type: ' + artist.kind);
    if (artist.status !== 'approved') errors.push('Unapproved artist in public registry: ' + artist.id);
    for (const field of ['name', 'role', 'statement', 'bio', 'verification']) {
      if (typeof artist[field] !== 'string' || !artist[field].trim()) errors.push('Missing ' + field + ' for ' + artist.id);
    }
    if (!Array.isArray(artist.exhibitIds) || !artist.exhibitIds.length) errors.push('Artist missing exhibit references: ' + artist.id);
    else for (const id of artist.exhibitIds) {
      if (!exhibits.has(id)) errors.push('Unknown exhibit ' + id + ' for ' + artist.id);
    }
    if (!Array.isArray(artist.creditLines) || !artist.creditLines.length) errors.push('Missing credit lines: ' + artist.id);
    else for (const credit of artist.creditLines) {
      if (!credit.contributor?.trim() || !credit.activity?.trim()) errors.push('Incomplete contribution attribution: ' + artist.id);
    }
  }
  return errors;
}
