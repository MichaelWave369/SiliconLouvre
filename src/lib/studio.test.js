import test from 'node:test';
import assert from 'node:assert/strict';
import { makeStudioSvg, normalizeStudioConfig, studioFilename, MODES, PRESETS, PALETTES } from './studio.js';

test('three artwork presets generate deterministic static SVG with correct motif counts', () => {
  for (const mode of MODES) {
    const config = PRESETS[mode];
    const svg = makeStudioSvg(config);
    assert.equal(svg, makeStudioSvg(config));
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /<\/svg>$/);
    assert.equal((svg.match(/data-motif="yes"/g) || []).length, config.rings * config.segments);
    assert.doesNotMatch(svg, /<script|<animate|<foreignObject|<image|<use/i);
  }
});

test('untrusted config values are constrained to safe documented bounds', () => {
  assert.deepEqual(normalizeStudioConfig({mode:'<script>', palette:'constructor', rings:-50, segments:999, twist:999}), {
    mode:'bloom', palette:'gilded', rings:2, segments:36, twist:90,
  });
  assert.deepEqual(normalizeStudioConfig({mode:'iris', palette:'neon', rings:'NaN', segments:null, twist:Infinity}),{
    mode:'iris', palette:'neon', rings:6, segments:6, twist:30,
  });
  assert.equal(Object.keys(PALETTES).length,4);
  assert.equal(studioFilename({mode:'clockwork',palette:'aurora',rings:7,segments:18}), 'silicon-louvre-clockwork-aurora-7x18.svg');
});

test('generated SVG never includes injected markup from config', () => {
  const svg=makeStudioSvg({mode:'<img src=x onerror=alert(1)>', palette:'<svg/onload=alert(1)>', rings:100, segments:100});
  assert.doesNotMatch(svg, /onerror|onload|alert\(1\)/);
  assert.equal((svg.match(/data-motif="yes"/g)||[]).length,9*36);
});
