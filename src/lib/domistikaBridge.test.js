import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { DOMISTIKA_URL, bridgeSupported, buildDomistikaHandoff, parseDomistikaHandoff } from './domistikaBridge.js';

test('only the known same-origin Domistika Pages deployment is supported', () => {
  assert.ok(bridgeSupported('https://michaelwave369.github.io'));
  assert.equal(bridgeSupported('http://localhost:5173'), false);
  assert.equal(bridgeSupported('https://example.com'), false);
  assert.equal(bridgeSupported('https://michaelwave369.github.io','https://evil.example/'), false);
  assert.equal(new URL(DOMISTIKA_URL).hash, '#silicon-louvre-import');
});

test('sender produces a bounded, digest-bound, expiring artwork transfer', async () => {
  globalThis.crypto ??= webcrypto;
  const now = 1_800_000_000_000;
  const payload = await buildDomistikaHandoff({mode:'clockwork',palette:'aurora',rings:7,segments:18,twist:-24},now);
  assert.equal(payload.schema,'silicon-louvre.domistika-handoff.v1');
  assert.equal(payload.recipe.mode,'clockwork');
  assert.match(payload.svgSha256,/^[a-f0-9]{64}$/);
  assert.equal(parseDomistikaHandoff(JSON.stringify(payload),now)?.svgSha256,payload.svgSha256);
  assert.equal(parseDomistikaHandoff(JSON.stringify(payload),now+301000),null);
  assert.equal(parseDomistikaHandoff(JSON.stringify({...payload,target:'other'}),now),null);
  assert.equal(parseDomistikaHandoff(JSON.stringify({...payload,svg:'x'.repeat(351000)}),now),null);
});
