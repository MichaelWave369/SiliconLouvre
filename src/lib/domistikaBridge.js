import { normalizeStudioConfig, makeStudioSvg } from './studio.js';

export const DOMISTIKA_HANDOFF_KEY = 'silicon-louvre-to-domistika-v1';
export const DOMISTIKA_URL = 'https://michaelwave369.github.io/Domistika/#silicon-louvre-import';
export const HANDOFF_SCHEMA = 'silicon-louvre.domistika-handoff.v1';
export const HANDOFF_TTL_MS = 5 * 60 * 1000;
export const MAX_SVG_LENGTH = 350_000;

export function bridgeSupported(currentOrigin, targetUrl = DOMISTIKA_URL) {
  try {
    const target = new URL(targetUrl);
    return target.protocol === 'https:' && target.origin === currentOrigin
      && target.hostname === 'michaelwave369.github.io'
      && target.pathname === '/Domistika/';
  } catch { return false; }
}

export async function sha256Hex(value, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) throw Error('SECURE_DIGEST_UNAVAILABLE');
  const bytes = new TextEncoder().encode(value);
  const buffer = await cryptoImpl.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
}

export async function buildDomistikaHandoff(config, time = Date.now()) {
  const normalized = normalizeStudioConfig(config);
  const svg = makeStudioSvg(normalized);
  if (!svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"') || svg.length > MAX_SVG_LENGTH) {
    throw Error('UNSUPPORTED_ARTWORK_PAYLOAD');
  }
  return {
    schema: HANDOFF_SCHEMA,
    source: 'silicon-louvre',
    target: 'domistika',
    createdAt: time,
    expiresAt: time + HANDOFF_TTL_MS,
    name: 'The Silicon Louvre · ' + normalized.mode,
    width: 800,
    height: 800,
    recipe: { ...normalized },
    svg,
    svgSha256: await sha256Hex(svg),
  };
}

export function parseDomistikaHandoff(raw, time = Date.now()) {
  if (typeof raw !== 'string' || raw.length > MAX_SVG_LENGTH + 4000) return null;
  try {
    const data = JSON.parse(raw);
    if (data?.schema !== HANDOFF_SCHEMA ||
        data.source !== 'silicon-louvre' || data.target !== 'domistika' ||
        data.width !== 800 || data.height !== 800 ||
        !Number.isFinite(data.createdAt) || !Number.isFinite(data.expiresAt) ||
        data.createdAt > time + 30_000 || data.expiresAt <= time ||
        data.expiresAt - data.createdAt > HANDOFF_TTL_MS ||
        typeof data.svg !== 'string' || data.svg.length > MAX_SVG_LENGTH ||
        !/^[a-f0-9]{64}$/.test(data.svgSha256 || '') ||
        typeof data.name !== 'string' || data.name.length > 120) return null;
    return data;
  } catch { return null; }
}
