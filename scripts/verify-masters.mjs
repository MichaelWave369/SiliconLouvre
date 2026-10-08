import { readdir, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { foundingMasters } from '../src/data/foundingMasters.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/assets/masters');
const known = new Map(foundingMasters.map((artwork) => [artwork.file, artwork]));
let names = [];
try {
  names = (await readdir(dir)).filter((name) => name.toLowerCase().endsWith('.webp'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const failures = [];
for (const file of names) {
  const art = known.get(file);
  if (!art) { failures.push(`Unknown image asset: ${file}`); continue; }
  const location = join(dir, file);
  const bytes = await readFile(location);
  const info = await stat(location);
  if (!info.isFile() || bytes.length < 1024 || bytes.length > 4_000_000) {
    failures.push(`Invalid file size for ${file}`); continue;
  }
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    failures.push(`Not a valid WebP header: ${file}`); continue;
  }
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== art.sha256) failures.push(`SHA-256 mismatch for ${file}: ${hash}`);
}
if (failures.length) {
  console.error('Founding Masters integrity check failed:\n' + failures.map((f) => ' - ' + f).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Founding Masters: ${names.length}/${foundingMasters.length} authorized WebP assets present and verified.`);
  if (names.length === 0) console.log('Original collection awaits the curator upload; Gallery Walk 001 remains available.');
}
