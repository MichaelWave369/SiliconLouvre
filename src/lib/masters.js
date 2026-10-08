export function masterFromHash(masters, hash) {
  const match = /^#master-([a-z0-9-]+)$/.exec(hash || '');
  return match ? (masters.find((item) => item.id === match[1]) ?? null) : null;
}

export function masterNextId(masters, id, delta = 1) {
  if (!masters.length) return null;
  const at = masters.findIndex((item) => item.id === id);
  if (at < 0) return masters[0].id;
  return masters[((at + delta) % masters.length + masters.length) % masters.length].id;
}
